---
title: "Tenderfi post-mortem"
date: 2023-03-08T16:27:04+07:00
draft: false
author: LowK
categories: ["post-mortem"]
tags: ["smart contracts", "hacking", "solidity"]
type: post
cover:
  src: "img/cover.png"
---

[Tenderfi](https://www.tender.fi/) is a project that is built on top of the Uniswap protocol. It is a decentralized lending protocol that allows users to borrow and lend assets on the Ethereum blockchain. The protocol is built on top of the Uniswap protocol and uses the Uniswap AMM to provide liquidity for the lending pool.

March 7th, 2023, the Twitter's Tenderfi was post a notification that the project was paused all borrowing. The reason for the pause was that the project team investigated the vulnerability of the project. The project team said that the vulnerability was found by a hacker and the hacker had exploited the vulnerability to steal 1.59 million USDT from the project. 

{{< tweet user="tender_fi" id="1633046169055281153" >}}

On March 6th, 2023, Tenderfi set up a new oracle to provide the price of GMX. The contract have getUnderlyingPrice function which exists a vulnerability caused by GMX price to be magnified by 1e20.

For details, as shown in the code below, the getUnderlyingPrice function will return the price of the underlying asset. If the underlying asset is GMX, the price will be multiplied by 1e20 and then by 1e10. This is the vulnerability.


```solidity
// https://arbiscan.io/address/0x614157925d4b6f7396cde6434998bfd04789272d#code 

contract GMXPriceOracle is PriceOracle {
    // ...

    function getGmxPrice() public view returns (uint256) {
      return gmxTokenPriceOracle.latestAnswer().mul(1e20); // @audit-issue - this is the vulnerability
    }
    
    function getUnderlyingPrice(CToken cToken) public override view returns (uint) {
        if(cToken.isGLP()){
            return getGlpAum().mul(1e18).div(glpToken.totalSupply());   
        } else if(compareStrings(cToken.symbol(), "tGMX")){
            return getGmxPrice().mul(1e10); // @audit-issue - this is the vulnerability
        } else if(compareStrings(cToken.symbol(), "tTND")){
          // four hour twap
          uint32 interval = 60*60*4;
          return tndOracle.getTndPrice(interval);
        } else {
            IERC20 underlying = IERC20(_getUnderlyingAddress(cToken));
            uint256 decimals = underlying.decimals();
            uint256 defaultDecimals = 18;
            return gmxPriceFeed.getPrice(_getUnderlyingAddress(cToken), true, true, false).mul(10**(defaultDecimals.sub(decimals).add(defaultDecimals))).div(1e30);
        }
    }

    // ...
}
```

However, the white hat hacker repaid all loans minus 62 ETH, which will be kept as a Bounty for helping secure the protocol. An on chain transaction was sent with an attached message that contains the teams of this argeement.
https://arbiscan.io/tx/0xdeb31360e395dcba28ec360f61c619f5ebd0db170a189b796631b2c6796e0b72
The white hat hacker's wallet: _0x896df3759205c141c97640b2b7345fa479feb1ab_ 

## A conversation between the hacker and Tenderfi team:

[[tx]](https://arbiscan.io/tx/0x38ae60739af0726831957546d9d16c92ed75164a1581d4e4e6f270917913ab9c) __Hacker (Mar-07-2023 10:28:30 AM +UTC)__: it looks like your oracle was misconfigured. contact me to sort this out   
[[tx]](https://arbiscan.io/tx/0x2aaf621d836cba195c710fa9596b42e45373da902eefd549585b62a7fb972c16)  __Team (Mar-07-2023 10:55:03 AM +UTC)__: are you a good person or bad person   
[[tx]](https://arbiscan.io/tx/0xea36d7ae2d0f1e159dbf7bc6bd95a64eda5c1680cf8d797e9ae7cdb3c52f7aaa) __Team (Mar-07-2023 11:12:20 AM +UTC)__: Thank you for reaching out. We have reverted to the previous price oracle. Can you please contact me at ben@tender.fi ?   
[[tx]](https://arbiscan.io/tx/0xdeb31360e395dcba28ec360f61c619f5ebd0db170a189b796631b2c6796e0b72)  __Team (Mar-07-2023 06:15:31 PM +UTC)__: The White Hat will repay all loans minus 62.158670296 ETH, which will be kept as a Bounty for helping secure the protocol. The Tender.fi Team will repay the Bounty s value to the protocol, so that there will be no bad debt and users will remain unaffected.  

## Details of the vulnerability
The attacker performs many transactions to borrow tokens (tLINK, tFRAX, tUSDT, tDAI, tUNI, tWBTC, tUSDC, tETH) from the protocol.

{{< figure src="img/list-borrow-trans.png" att="borrow transactions" >}}

Analyze a specific transaction, the attacker borrowed 16203.0 tLINK. The transaction is [0xf14df8](https://arbiscan.io/tx/0xf14df8a4220bdcc26e1615ab777e3777e5d164097ef524ab0c1bf2c64d6c63de)

{{< figure src="img/borrow-tLINK.png" att="borrow tLINK" >}}

We consider a function borrowAllowed in the above contract Comptroller
```solidity
/**
 * @title Compound's Comptroller Contract
 * @author Compound
 */
contract Comptroller is
    ComptrollerV7Storage,
    ComptrollerInterface,
    ComptrollerErrorReporter,
    ExponentialNoError
{
   /**
     * @notice Checks if the account should be allowed to borrow the underlying asset of the given market
     * @param cToken The market to verify the borrow against
     * @param borrower The account which would borrow the asset
     * @param borrowAmount The amount of underlying the account would borrow
     * @return 0 if the borrow is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol)
     */
    function borrowAllowed(
        address cToken, // @audit-info: tLINK
        address borrower, // @audit-info: hacker's address
        uint256 borrowAmount // @audit-info: 16203 * e18
    ) external override returns (uint256) {
        // Pausing is a very serious situation - we revert to sound the alarms
        require(!borrowGuardianPaused[cToken], "borrow is paused");

        // ... checkin conditions

        (
            Error err,
            ,
            uint shortfall
        ) = getHypotheticalAccountLiquidityInternal(
                borrower, 
                CToken(cToken), 
                0,
                borrowAmount, 
                false
            );

        // ... handle errors

        // ... Keep the flywheel moving 

        return uint256(Error.NO_ERROR);
    }

    // ...
    
    /**
     * @notice Determine what the account liquidity would be if the given amounts were redeemed/borrowed
     * @param cTokenModify The market to hypothetically redeem/borrow in
     * @param account The account to determine liquidity for
     * @param redeemTokens The number of tokens to hypothetically redeem
     * @param borrowAmount The amount of underlying to hypothetically borrow
     * @param liquidation Whether the calls is for liquidation or not
     * @dev Note that we calculate the exchangeRateStored for each collateral cToken using stored data,
     *  without calculating accumulated interest.
     * @return (possible error code,
                hypothetical account liquidity in excess of collateral requirements,
     *          hypothetical account shortfall below collateral requirements)
     */  
    function getHypotheticalAccountLiquidityInternal(
        address account, // @audit-info : hacker's address
        CToken cTokenModify, // @audit-info : tLINK
        uint redeemTokens, // @audit-info : 0
        uint borrowAmount, // @audit-info: 16203 * e18
        bool liquidation // @audit-info : false
    ) internal view returns (Error, uint, uint) {
        // For each asset the account is in
        CToken[] memory assets = accountAssets[account];
        for (uint i = 0; i < assets.length; i++) {
            CToken asset = assets[i];

            // ... Read the balances and exchange rate from the cToken

            // ... Get exchangeRateMantissa
            
            vars.exchangeRate = Exp({mantissa: vars.exchangeRateMantissa});

            // Get the normalized price of the asset
            vars.oraclePriceMantissa = oracle.getUnderlyingPrice(asset); // @audit-issue : vulnerable here, assets contain `tGMX`
            if (vars.oraclePriceMantissa == 0) {
                return (Error.PRICE_ERROR, 0, 0);
            }
            vars.oraclePrice = Exp({mantissa: vars.oraclePriceMantissa});

            // ...
        }
    }
}

contract GMXPriceOracle is PriceOracle {
    // ...

    function getGmxPrice() public view returns (uint256) {
      // @audit-issue - gmxTokenPriceOracle.latestAnswer() to return the price of GMX with 8 decimals
      return gmxTokenPriceOracle.latestAnswer().mul(1e20); 
    }
    
    function getUnderlyingPrice(CToken cToken) public override view returns (uint) {
        if(cToken.isGLP()){
            return getGlpAum().mul(1e18).div(glpToken.totalSupply());   
        } else if(compareStrings(cToken.symbol(), "tGMX")){
            return getGmxPrice().mul(1e10); // @audit-issue - this is the vulnerability
        } else if(compareStrings(cToken.symbol(), "tTND")){
          // four hour twap
          uint32 interval = 60*60*4;
          return tndOracle.getTndPrice(interval);
        } else {
            IERC20 underlying = IERC20(_getUnderlyingAddress(cToken));
            uint256 decimals = underlying.decimals();
            uint256 defaultDecimals = 18;
            return gmxPriceFeed.getPrice(_getUnderlyingAddress(cToken), true, true, false).mul(10**(defaultDecimals.sub(decimals).add(defaultDecimals))).div(1e30);
        }
    }

    // ...
}

```
In theory, getUnderlyingPrice should return a price with 1e18 decimals, but the error caused the price(1e38 decimals) obtained by Tenderfi to be much higher than expected.
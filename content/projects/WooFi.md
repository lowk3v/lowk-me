---
title: "Woo Finance - Users can lose their money if they use cross-swap in some situations."
description: Users can lose their money if there is any reverts when use crossSwap in Woo Finance.
repository: woonetwork/WooPoolV2
date: "2023-10-06"
published: false
featured: true
---

I discovered some high-impact vulnerabilities in WooFi smart contracts. 
Users can lose their money if they use the function "crossSwap" in WooCrossChainRouter, WooCrossChainRouterV2, and WooCrossChainRouterV3 contracts. 
Following the details below:

In the contract "WooCrossChainRouter" at

- https://github.com/woonetwork/WooPoolV2/blob/6b7d13fea34a78ca59e4b1aae73d3caa00c2efba/contracts/WooCrossChainRouter.sol#L250-L368
- https://arbiscan.io/address/0x44df096d2600c6a6db77899db3de3aecff746cb8
- and in other chains.

```solidity
function sgReceive(
        uint16, /*_chainId*/
        bytes memory, /*_srcAddress*/
        uint256, /*_nonce*/
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external override {
        require(msg.sender == address(stargateRouter), "WooCrossChainRouter: INVALID_CALLER");

        (address toToken, uint256 refId, uint256 minToAmount, address to) = abi.decode(
            payload,
            (address, uint256, uint256, address)
        );

        if (wooRouter.wooPool().quoteToken() != _token) {
            // NOTE: The bridged token is not WooPP's quote token.
            // So Cannot do the swap; just return it to users.
            // ..
        }

        uint256 quoteAmount = amountLD;

        if (toToken == ETH_PLACEHOLDER_ADDR) {
            // quoteToken -> WETH -> ETH
            TransferHelper.safeApprove(_token, address(wooRouter), quoteAmount);
            try wooRouter.swap(_token, WETH, quoteAmount, minToAmount, payable(address(this)), to) returns (
                uint256 realToAmount
            ) {
                IWETH(WETH).withdraw(realToAmount);
                TransferHelper.safeTransferETH(to, realToAmount);
                emit WooCrossSwapOnDstChain(...);
            } catch {
                // transfer _token/amountLD to msg.sender because the swap failed for some reason.
                // this is not the ideal scenario, but the contract needs to deliver them eth or USDC.
                TransferHelper.safeTransfer(_token, to, amountLD);
                emit WooCrossSwapOnDstChain(...);
            }
        } else {
            // ...
        }
    }
```

The "crossSwap" function allows users to send and swap cross-chains.

When users call the "crossSwap" function to swap in a source chain, a "StarGateRouter" contract will callback to the "sgReceive" function in a destination chain.

The contract "WooCrossChainRouter" uses a try-catch block to handle reverting. If any revert is raised, the user in the destination chain will not receive their fund.

An example scenario:

1. A user cross-swaps in the source chain with the `toToken` parameter equal to the ETH_PLACEHOLDER_ADDR constant, and `toToken` is a quote token.

2. In the destination chain, the contract will swap `_token` to WETH. After that, transferring these ETH to an address the user owned

3. The swap is OK and is wrapped by a try-catch block. However, the transfer of ETH is not protected. If the receiving address does not define fallback() or receive() functions, it will revert.

If any reverts occur, the user will lose their money, and the money will be held in this contract.


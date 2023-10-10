---
title: LayerZero Integrations Security Tips
description: LayerZero integrations security tips for smart contract developers and auditors.
repository: 
date: 2023-10-10
published: true
featured: true
author: LowK
---

LayerZero is an omnichain interoperability protocol designed for lightweight message passing across chains. 
LayerZero provides authentic and guaranteed message delivery with configurable trustlessness.
Needs more information about LayerZero check out the [docs](https://layerzero.gitbook.io/docs/).  

If you are a smart contract developer or auditor, you should be aware of the following security tips 
when integrating LayerZero into your smart contracts.

## Security Tips

1. Calling `send()` with `{value: msg.value}` is because `send()` **requires a bit of native gas token** so the relayer can complete the message delivery on the destination chain. If you don't set this value [you might get this error](notion://www.notion.so/docs/evm-guides/error-messages/error-layerzero-relayer-fee-failed) when calling `endpoint.send()`

2.  In a received chain, A **msg.sender is the LZ endpoint**. Are there any mistakes?

3. **Address Sanity Check** In a receiving chain
    
    Is SrcAddress whitelisted?
    
    Check the address size according to the source chain (e.g. address size == 20 bytes on EVM chains) to prevent a vector unauthenticated contract call.
    
4.  In a received chain, parse srcAddress to the address type that is just applied for EVM chains. **Is your application connected with non-e chain?**

5. **Is there a set of trusted remote addresses**? The feature is available at some places that must be checked:
    - retryPayload()::srcAddress
    - hasStoredPayload()::srcAddress
    - forceResumeReceive()::srcAddress
    - setTrustedRemote()::path
    - isTrustedRemote()::_srcAddress
    - lzReceive()::_srcAddress
6. **Should implement an *Instant Finality Guarantee (IFG)***
    
    Reverting in (user application) UA is cumbersome and expensive. It is more efficient to design your UA with IFG such that if a transaction was accepted at source, the transaction will be accepted at the remote. For example, Stargate has a credit management system (Delta Algorithm) to guarantee that if a swap was accepted at source, the destination must have enough asset to complete the swap, hence the IFG.
    
7. **Tracking the nonce**

8. **One action per message**: only one thing per message

9. **Store failed message**: [example](https://solodit.xyz/issues/h-06-attacker-can-block-layerzero-channel-code4rena-velodrome-finance-velodrome-finance-git)
    
    If the message execution fails at the destination, try-catch it, and store it for future retries. From LayerZero's perspective, the message has been delivered. It is much cheaper and easier for your programs to recover from the last state at the destination chain.
    Store a hash of the message payload is much cheaper than storing the whole message
    
    *sink*: not implement `blockingLzReceive()`
    
10. **Gas for Message Types**
    
    *If your app includes multiple message types to be sent across chains,* compute a rough gas estimate at the destination chain per each message type.
    
    *Your message may fail for the out-of-gas exception at the destination if your app did not instruct the relayer to put extra gas on contract execution*. 
    
    And the UA should enforce the gas estimate on-chain at the source chain to prevent users from inputting too low a value for gas.
---
title: "Sushiswap Attack Analysis"
date: 2023-04-10T09:27:17+07:00
draft: false
author: LowK
categories: ["post-mortem"]
tags: ["smart contracts", "hacking", "solidity"]
type: post
cover:
  src: "img/cover.png"
---

Type attack #accesscontrol

Project #Sushiswap suffered an attack due to a vulnerability in the RouteProccessor2 contract. This contract includes a processRoute function, which is responsible for processing off-chain generated routes.

{{< tweet user="SushiSwap" id="1645064984622407680" >}}

The bug is caused by a lack of proper access control in the function, which enable a malicious user to swap any token through the router. This allowed the attacker to drain the balances of any user who had previously approved the route to withdraw their tokens.

In simpler terms, when a user initiates a swap using any route, they typically approve the router to withdraw the maximum balance of the token. Due to the vulnerability, the attacker was able to take advantage of this approval to drain users' balances.

The hacker just called processRoute and passed a victim's address and BUZZ balances of the victim become to balances of the hacker.

{{< figure src="img/sushi.png" att="Sushiswap's RouteProccessor2 contract" >}}

// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const TEN_MINS_FROM_NOW = new Date().getTime() + 10 * 60 * 1000;
const ONE_HBAR: bigint = ethers.parseEther("1");

const LockModule = buildModule("LockModule", (m) => {
  const lock = m.contract("Lock", [TEN_MINS_FROM_NOW], {
    value: ONE_HBAR
  });

  return { lock };
});

export default LockModule;

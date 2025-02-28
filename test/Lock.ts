import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { expect } from "chai";
import { ethers, ignition } from "hardhat";
import { Contract } from "ethers";
import { Client, ContractExecuteTransaction, ContractId, PrivateKey, ScheduleSignTransaction, Timestamp } from "@hashgraph/sdk";
import { ScheduleCreateTransaction } from "@hashgraph/sdk";

const LOCK_EXPIRY_TIME = Math.floor(new Date().getTime() / 1000) + 1 * 60; // 1 minute from now (format for EVM)
const SCHEDULE_EXPIRY_TIME = new Date().getTime() + 2 * 60 * 1000; // 2 minutes from now in milliseconds (format for Hedera)
const ONE_HBAR: bigint = ethers.parseEther("1");

const LockModule = buildModule("LockModule_" + Math.floor(Math.random() * 1000), (m) => {
  const lock = m.contract("Lock", [LOCK_EXPIRY_TIME], {
    value: ONE_HBAR
  });

  return { lock };
});

let lock: Contract;

describe("Lock", function () {

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const deployment = await ignition.deploy(LockModule);
      lock = deployment.lock;
      expect(await lock.unlockTime()).to.equal(LOCK_EXPIRY_TIME);
    });

    it("Should check owner is deployer", async function () {
      const [deployer] = await ethers.getSigners();
      expect(await lock.owner()).to.equal(deployer.address);
    });

    it("Should check balance is locked", async function () {
      expect(await ethers.provider.getBalance(lock.target)).to.equal(
        ONE_HBAR
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });
    });
  });

  describe("Schedule Transaction", function () {
    it("Should schedule contract execution for the future", async function () {
      // Create client as we will be using Hedera SDK to schedule the transaction
      const privateKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!);
      const client = Client.forTestnet().setOperator(process.env.ACCOUNT_ID!, privateKey);
      // inititate contract id in Hedera SDK compatible format
      const contractId = ContractId.fromEvmAddress(0, 0, lock.target.toString());

      // 1. Create contract execute tx to call withdraw
      const contractExecTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction("withdraw")
        .setGas(100000);

      // 2. Create schedule tx that will execute the contract call in 2 mins 
      const scheduleTx = new ScheduleCreateTransaction()
        .setScheduledTransaction(contractExecTx)
        .setExpirationTime(Timestamp.fromDate(new Date(SCHEDULE_EXPIRY_TIME)))
        .setWaitForExpiry(true);

      // 3. Sign and submit the schedule tx
      const executeResponse = await scheduleTx.execute(client);
      const executeReceipt = await executeResponse.getReceipt(client);
      expect(executeReceipt.status.toString()).to.equal("SUCCESS");
    });
  });
});

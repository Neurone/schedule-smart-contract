const { ContractId, Client, PrivateKey, Timestamp } = require("@hashgraph/sdk")
require("dotenv").config()

const main = async () => {
    const client = Client.forTestnet().setOperator(process.env.ACCOUNT_ID, PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY));
    const beforePopulatedContractId = ContractId.fromEvmAddress(0, 0, "0xdc2253Eb59d4Eac975452cAf4DAb5323Cb044cEF")
    const contractId = await beforePopulatedContractId.populateAccountNum(client);
}

main()
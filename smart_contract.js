const {
    Client,
    AccountId,
    PrivateKey,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractCallQuery,
    ContractExecuteTransaction,
    ContractInfoQuery
} = require("@hashgraph/sdk");
require("dotenv").config();

const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function deploySmartContract() {
    //import the compiled contract from the HelloHedera.json file
    let helloHedera = require("./hello_hedera.json");
    const bytecode = helloHedera.data.bytecode.object;

    //create a file on Hedera and store the hex-encoded bytecode
    let createFileTx = new FileCreateTransaction()
            //set the bytecode of the contract
            .setContents(bytecode);

    /*submit the file to the Hedera test network signing with 
    the transaction fee payer key specified with the client*/
    const submitTx = await createFileTx.execute(client);

    //get the receipt
    const fileReceipt = await submitTx.getReceipt(client);

    //get the file id from the receipt and log the file id
    const bytecodeFileID = fileReceipt.fileId;
    console.log(`The smart contract bytecode file ID: ${bytecodeFileID}`);

    //Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileID)//set the file id of the Hedera file storing the bytecode
        .setGas(400000)//set the gas to instantiate the contract
        .setConstructorParameters(//provide the constructor parameters for the contract
            new ContractFunctionParameters().addString("Hello from Hedera !")
        );

    //submit the trx to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //get the receipt of the file create trx
    const contractReceipt = await contractResponse.getReceipt(client);

    //get the smart contract id and log it
    const contractId = contractReceipt.contractId;
    console.log(`The deployed smart contract ID is : ${contractId}`)
    
    return contractId;
}

async function queryMessage(contractId) {
    const contractQuery = await new ContractCallQuery()
        .setGas(100000)//set the gas for the query
        .setContractId(contractId)//set the contract id to return the request for
        .setFunction("get_message");

    //submit to a Hedera network
    const response = await contractQuery.execute(client);

    //get a string from the result at index 0 and log it
    const message = response.getString(0);
    console.log(`Smart contract returned this message : ${message} `);
}

async function setMessage(contractId, message) {
    //create the trx to update the contract message
    const contractExecTx = await new ContractExecuteTransaction()
        .setContractId(contractId)//set the id of the contract
        .setGas(100000)//set the gas for the contract call
        .setFunction(
            "set_message",
            new ContractFunctionParameters().addString(message)
        );
    //submit the trx to a Hedera network and store the response
    const submitExecTx = await  contractExecTx.execute(client);

    //get the receipt of the transaction
    const receipt = await submitExecTx.getReceipt(client);
    console.log(
        "Updated message successfully",
        message,
        submitExecTx.transactionId.toString()
    );
}

async function getSmartContractInfo(contractId) {
    //create the query
    const query = new ContractInfoQuery().setContractId(contractId);

    //sign the query with the client operator private key and submit to a Hedera network
    const info = await query.execute(client);
    console.log(info);
}

async function main() {
    const contractID = await deploySmartContract();
    await getSmartContractInfo(contractID);
    await queryMessage(contractID);
    await setMessage(contractID, "Hola ! It's me");
    await queryMessage(contractID);

}

main();


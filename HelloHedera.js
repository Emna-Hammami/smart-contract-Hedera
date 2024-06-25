const { FileCreateTransaction, PrivateKey, Client, ContractCreateTransaction, ContractFunctionParameters, ContractCallQuery, Hbar, ContractExecuteTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

if (!myAccountId || !myPrivateKey) {
    throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
}

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

let helloHedera = require("./HelloHedera.json");
const bytecode = helloHedera.data.bytecode.object;

async function HelloHedera(){
    const fileCreateTx = new FileCreateTransaction()
                            .setContents(bytecode);
    const submitTx = await fileCreateTx.execute(client);

    const receipt = await submitTx.getReceipt(client);
    const fileId = receipt.fileId;
    console.log("The SC bytecode file ID : "+fileId);
    console.log("**************");

    const contractTx = await new ContractCreateTransaction()
                .setBytecodeFileId(fileId)
                .setGas(200000)
                .setConstructorParameters(new ContractFunctionParameters().addString("Hello, I'm Emna !"));
   const contractResponse = await contractTx.execute(client);
   const contractId = (await contractResponse.getReceipt(client)).contractId;
   console.log("The SC contract ID : "+contractId);
   console.log("**************");

   const contractQuery = await new ContractCallQuery()
                .setGas(200000)
                .setContractId(contractId)
                .setFunction("get_message")//Set the contract function to call
                .setQueryPayment(new Hbar(2));
    const getMessage = await contractQuery.execute(client);
    console.log("The SC message : "+getMessage.getString(0));// Get a string from the result at index 0
    console.log("**************");

    const contractExecTx = await new ContractExecuteTransaction()//create the tx to update the sc message
                .setGas(200000)
                .setContractId(contractId)
                .setFunction("set_message", new ContractFunctionParameters().addString("Hello, it's me again !"));//Set the contract function to call
    const receipt_ = (await contractExecTx.execute(client)).getReceipt(client);
    console.log("The transaction status is " +(await receipt_).status);
    console.log("**************");

    const contractCallQuery = new ContractCallQuery()
                .setGas(200000)
                .setContractId(contractId)
                .setFunction("get_message")//Set the contract function to call
                .setQueryPayment(new Hbar(2));
    const contractUpdateResult = await contractCallQuery.execute(client);
    console.log("The updated SC message : "+contractUpdateResult.getString(0));// Get a string from



}

HelloHedera();

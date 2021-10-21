import {
    Biconomy
} from "@biconomy/mexa";
import * as ethers from 'ethers';
import * as sigUtil from "eth-sig-util";

let provider = ethers.getDefaultProvider();

const biconomy = new Biconomy(provider, {
    apiKey: "dc7LqAGO2.1ba1ee9c-b3b7-45f4-9484-5fa75415b013",
    debug: true
});
// let ethersProvider = new ethers.providers.Web3Provider(biconomy);


(async () => {
    // Initialize Constants
    const contractAbi = [{
            "inputs": [{
                "internalType": "address",
                "name": "_trustedForwarder",
                "type": "address"
            }],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "forwarder",
                "type": "address"
            }],
            "name": "isTrustedForwarder",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "num",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "n",
                "type": "uint256"
            }],
            "name": "setNum",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "trustedForwarder",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "versionRecipient",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    // Initialize Constants
    let contract = new ethers.Contract( "0x92ba514d065997c68828355a724D519c35Cde17f" , 
         contractAbi , biconomy.getSignerByAddress(userAddress));

    let contractInterface = new ethers.utils.Interface( contractAbi );

    let userAddress = "0x1A1d773622b9d27626Cc4B414CE9A4eEFA27Ad0D" ;
    let privateKey = "0xeca598b88a0e0360b4ddd0211384c0b93aff8e0e1ad93c260ff1b491b3534472";

    let userSigner = new ethers.Wallet(privateKey);

    // Create your target method signature.. here we are calling setQuote() method of our contract
    let functionSignature = contractInterface.encodeFunctionData("setNum", [123]);

    let rawTx = {
        to: "0x92ba514d065997c68828355a724D519c35Cde17f" ,
        data: functionSignature,
        from: userAddress
    };

    let signedTx = await userSigner.signTransaction(rawTx);
    // should get user message to sign for EIP712 or personal signature types
    const forwardData = await biconomy.getForwardRequestAndMessageToSign(signedTx);
    console.log(forwardData);

    // optionally one can sign using sigUtil
    const signature = sigUtil.signTypedMessage(new Buffer.from(privateKey, 'hex'), {
        data: forwardData.eip712Format
    }, 'V3');

    let data = {
        signature: signature,
        forwardRequest: forwardData.request,
        rawTransaction: signedTx,
        signatureType: biconomy.EIP712_SIGN
    };

    let provider = biconomy.getEthersProvider();
    // send signed transaction with ethers
    // promise resolves to transaction hash                  
    let txHash = await provider.send("eth_sendRawTransaction", [data]);

    let receipt = await provider.waitForTransaction(txHash);
    //do something
})();
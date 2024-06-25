/*const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'HelloHedera.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'HelloHedera.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            }
        }
    }
};

//compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
};

const contract = output.contracts['HelloHedra.sol']['HelloHedra'];

//ensure the build directory exists
const buildDir = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

fs.writeFileSync(path.resolve(buildDir, 'HelloHedera.json'), JSON.stringify(contract.abi, null, 2));
fs.writeFileSync(path.resolve(buildDir, 'HelloHedera.bin'), contract.evm.bytecode.object);

console.log('Compilation successful!');*/
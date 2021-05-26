require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");

// Include Babel so that we may use some newer JavaScript syntax.
require('@babel/register');

// Include Waffle with Ethers as our preferred engine for testing.
require('@nomiclabs/hardhat-waffle');

// Include the detailed gas usage reporter for tests.
require('hardhat-gas-reporter');

// Include the contract size output display.
require('hardhat-contract-sizer');

// Include coverage checking for unit tests.
require('solidity-coverage');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const prv = process.env.PRIVATE_KEY;
const infura = process.env.WEB3_INFURA_PROJECT_ID;
const ether = process.env.ETHERSCAN_TOKEN


const mainPrv = process.env.MAIN_PRIVATE;
const mainUrl = process.env.MAIN_PROVIDER;

module.exports = {
  solidity: {
		compilers: [
      {
				version: '0.8.0',
        settings: {
					optimizer: {
						enabled: true
					}
				}
			},
			{
				version: '0.6.12',
				settings: {
					optimizer: {
						enabled: true
					}
				}
			},
			{
				version: '0.7.3',
				settings: {
					optimizer: {
						enabled: true
					}
				}
			},
			{
				version: '0.7.6',
				settings: {
					optimizer: {
						enabled: true
					}
				}
			},
      {
				version: '0.4.15'
			}

		]
	},

  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + process.env.WEB3_INFURA_PROJECT_ID,
      accounts: [prv],
      gasPrice: 20000000000,
      loggingEnabled: true
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [prv]
    },
    development: {
      url: "http://127.0.0.1:8545",
      accounts: [prv]
    }
  },


  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_TOKEN
    // apiKey: process.env.BSCSCAN_TOKEN
  },
  bscscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.BSCSCAN_TOKEN
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }

};

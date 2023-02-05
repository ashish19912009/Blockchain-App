// https://eth-goerli.g.alchemy.com/v2/lLCR9gcKpZ09aSL4I1ae6FvQDjY9zdfq

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/lLCR9gcKpZ09aSL4I1ae6FvQDjY9zdfq',
      accounts:['14e8edfef639b4ccfc1c3c67375122fba14409afd99276fbf2a4671063444fd2']
    } 
  }
}
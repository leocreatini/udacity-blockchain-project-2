# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use yarn or NPM to install the dependencies
```
yarn

// or

npm install
```


## Testing

```
yarn test

// or

npm test
```

Should get something like so:
```
PASS  tests/simpleChain.test.js
  addBlock()
    √ should include a method to store newBlock with LevelDB (49ms)
    √ should persist the Genesis block as the first block in the blockchain using LevelDB (41ms)
  validateBlock()
    √ should validate a block stored within levelDB (37ms)
    √ should validate blockchain stored within levelDB (40ms)
  getBlock()
    √ should retrieve a block by block height within the LevelDB chain (40ms)
  getBlockHeight()
    √ should retrieve the current block height within the LevelDB chain (50ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.24s
Ran all test suites.
```

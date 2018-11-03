# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

**Must use `node@^v8.0.0` or greater.**

### Configuring your project

- Use yarn or npm to install the dependencies

```bash
yarn
```

```bash
npm install
```

## Using

I took the liberty to update how the LevelDB was implemented. Instead of only having a single database, I encapsulated all the functionality to a `Database` class. You need to pass it a path location (string) when instantiating a new one.

The Blockchain makes a new `chain` based on the `Database` class. Therefore, you need to pass the new `Blockchain` class a string to setup the database.

Also, the blockchain object has an `init()` method to create the genesis block.

- At minimum, you will need to run:

```js
const blockchain = new Blockchain('./path/to/create/database');

blockchain.init();

// now we can add new blocks as needed.
blockchain.addBlock(new Block('the second block in the chain'));

// and check to see that the chain is good.
blockchain.validateChain();
```


## Testing

Test cases were created to meet rubric critera for the project.

The test will create a new database for each described feature, and then after it is complete. It will automatically clean up the `/test-chaindata` folder for you.

**Warning:** if the test fails, it will not get a chance to clean up the test-database directories; you will have to do that manually before re-running the tests.

- To run tests, use either yarn or npm like so:

```bash
yarn test
```

```bash
npm test
```

Should get something like so:

```plain
PASS  tests/levelSandbox.test.js
PASS  tests/simpleChain.test.js
```

Or if you only test the blockchain:

```plain
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

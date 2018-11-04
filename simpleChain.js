// local imports
const { GENESIS_BLOCK_DATA } = require('./constants');
const { Block } = require('./Block');
const { Database } = require('./levelSandbox');
const { getCurrentTime, createHash } = require('./utils');


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
class Blockchain {
  constructor(dbLocation) {
    return (async () => {
      this.chain = new Database(dbLocation);
      await this.init();

      return this;
    })();
  }

  async init() {
    await this.addBlock(new Block(GENESIS_BLOCK_DATA));
  }

  // Add new block
  async addBlock(newBlock) {
    const currentHeight = await this.getBlockHeight();
    // Block height
    newBlock.height = currentHeight + 1;
    // UTC timestamp
    newBlock.time = getCurrentTime();
    // previous block hash
    if (currentHeight > 0) {
      const previousBlock = await this.chain.getValue(currentHeight);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = createHash(newBlock);
    // Adding block object to chain
    await this.chain.push(newBlock);
  }

  // Get block height
  async getBlockHeight() {
    const chainLength = await this.chain.getLength();
    return chainLength - 1; // height is zero-index, which is one less than length.
  }

  // get block
  async getBlock(blockHeight) {
    const block = await this.chain.getValue(blockHeight);
    return block;
  }

  // validate block
  async validateBlock(blockHeight) {
    // get block object
    const block = await this.getBlock(blockHeight);
    // make copy of block hash
    const blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash for validation
    let validBlockHash = createHash(block);
    // Compare
    const isValid = (blockHash === validBlockHash);
    
    if (!isValid) {
      console.log(`Block #${blockHeight} invalid hash:\n${blockHash}<>${validBlockHash}`);
    }

    return isValid;
  }

  // Validate blockchain
  async validateChain() {
    const chain = await this.chain.getData();
    const naughtyList = [];
    
    // had to use ugly for loop because of await/async limitations with .reduce() :(
    for (let index = 0, length = chain.length; index < length; index++) {
      const block = chain[index];
      const lastIndex = index - 1;
      const previousHash = lastIndex > 0
        ? chain[lastIndex].previousBlockHash
        : block.hash; // genesis block won't have a previousBlockHash

      // validate block
      const isValidBlock = await this.validateBlock(index);
      // compare blocks hash link
      const isValidOrder = block.hash === previousHash;
      
      // if the block is invalid or is out of place, add it to the naughty list
      if (!isValidBlock || !isValidOrder) {
        naughtyList.push(index);
      }
    }
    
    if (naughtyList.length > 0) {
      console.log(`Amount of block errors: ${naughtyList.length}`);
      console.log(`Blocks: ${naughtyList}`);
    }

    return naughtyList.length === 0;
  }
}

exports.Blockchain = Blockchain;

// global imports
const sha256 = require('crypto-js/sha256');

// local imports
const { Database } = require('./levelSandbox');

// local imports
const { GENESIS_BLOCK_DATA } = require('./constants');

// utils
const getCurrentTime = () => new Date().getTime().toString().slice(0, -3);

const createHash = block => sha256(JSON.stringify(block)).toString();

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
class Block {
	constructor(data) {
     this.hash = '',
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ''
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
class Blockchain {
  constructor(dbLocation) {
    this.chain = new Database(dbLocation);
  }

  async init() {
    await this.addBlock(new Block(GENESIS_BLOCK_DATA));
  }

  // Add new block
  async addBlock(newBlock) {
    const currentHeight = await this.getBlockHeight();
    // Block height
    newBlock.height = currentHeight;
    // UTC timestamp
    newBlock.time = getCurrentTime();
    // previous block hash
    if (currentHeight > 0) {
      const previousBlock = await this.chain.getValue(currentHeight - 1);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = createHash(newBlock);
    // Adding block object to chain
    await this.chain.push(newBlock);
  }

  // Get block height
  async getBlockHeight() {
    return await this.chain.getLength();
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

module.exports = {
  Block,
  Blockchain,
};

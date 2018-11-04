// local imports
const {  TEST_DATA_DIR, GENESIS_BLOCK_DATA } = require('../constants');
const { Blockchain } = require('../simpleChain');
const { Block } = require('../Block');


describe('addBlock()', async () => {
  it('should include a method to store newBlock with LevelDB', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/1`);
    const block = new Block('yip yip');
    
    await blockchain.addBlock(block);

    const result = await blockchain.getBlock(1);
    const expectation = block;

    expect(result).toEqual(expectation);
  });

  it('should persist the Genesis block as the first block in the blockchain using LevelDB', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/2`);
    const block = new Block('waka waka');
    
    await blockchain.addBlock(block);

    const genesisBlock = await blockchain.getBlock(0);
    const result = genesisBlock.body;
    const expectation = GENESIS_BLOCK_DATA;

    expect(result).toBe(expectation);
  });
});

describe('validateBlock()', () => {
  it('should validate a block stored within levelDB', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/3`);
    const block = new Block('keto neko');
    
    await blockchain.addBlock(block);
    
    const result = await blockchain.validateBlock(1);
    const expectation = true;

    expect(result).toBe(expectation);
  });

  it('should validate blockchain stored within levelDB', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/4`);
    const block = new Block('jo jo');
    
    await blockchain.addBlock(block);

    const result = await blockchain.validateChain();
    const expectation = true;

    expect(result).toBe(expectation);
  });
});

describe('getBlock()', () => {
  it('should retrieve a block by block height within the LevelDB chain', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/5`);
    const block1 = new Block('money');
    const block2 = new Block('dinero');
    const block3 = new Block('okane');
    
    await blockchain.addBlock(block1);
    await blockchain.addBlock(block2);
    await blockchain.addBlock(block3);

    const result = await blockchain.getBlock(2);
    const expectation = block2;

    expect(result).toEqual(expectation);
  });
});

describe('getBlockHeight()', () => {
  it('should retrieve the current block height within the LevelDB chain', async () => {
    const blockchain = await new Blockchain(`${TEST_DATA_DIR}/6`);
    const block1 = new Block('now');
    const block2 = new Block('das');
    const block3 = new Block('a');
    const block4 = new Block('test');
    
    await blockchain.addBlock(block1);
    await blockchain.addBlock(block2);
    await blockchain.addBlock(block3);
    await blockchain.addBlock(block4);

    const result = await blockchain.getBlockHeight();
    const expectation = 4;

    expect(result).toEqual(expectation);
  });
});
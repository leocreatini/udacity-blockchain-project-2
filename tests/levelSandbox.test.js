
// local imports
const { TEST_DATA_DIR } = require('../constants');
const { Database } = require('../levelSandbox');

describe('Database', async () => {
  it('should be a class', async () => {
    const db = new Database(`${TEST_DATA_DIR}/0`);

    const result = typeof db;
    const expectation = 'object';

    expect(result).toBe(expectation);
  });
});

/* ===== Testing ==============================================================|
|  - Self-invoking  to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

const test = async () => {
  const db = new Database(TEST_DATA_DIR);

  const testLoop = async (i) => {
    setTimeout(async () => {
      await db.push('Testing data');
      if (--i) {
        testLoop(i);
      }
    }, 100);
  };

  await testLoop(10);
};

test();
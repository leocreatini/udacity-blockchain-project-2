/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

// global imports
const level = require('level');

// Database class
class Database {
  constructor(location) {
    this.database = level(location);
  }

  getData() {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        let list = [];
        return self.database
          .createReadStream()
          .on('error', err => reject(err))
          .on('data', data => list.push(data))
          .on('close', () => resolve(list));
      } catch (error) {
        return reject(error)
      }
    });
  }

  // Get data from levelDB with key
  async getValue(dirtyKey) {
    const self = this;
    const key = dirtyKey.toString(); // ensure it's a string
    try {
      const data = await self.getData();
      const filtered = data.filter(item => item.key === key)[0];
      if (!data || filtered.length === 0) {
        throw new Error('No data found!');
      }
      return JSON.parse(filtered.value);
    } catch (error) {
      console.log('getValue -- error', key, error);
    }
  }

  // Add data to levelDB with key/value pair
  async addKeyValue(dirtyKey, value) {
    const self = this;
    const key = dirtyKey.toString(); // ensure it's a string
    try {
      await self.database.put(key, JSON.stringify(value));
    } catch (error) {
      console.log('addKeyValue -- error', error);
    }
  }


  // Add data to levelDB with value
  async push(value) {
    const self = this;
    try {
      const height = await self.getLength();
      await this.addKeyValue(height.toString(), value);
    } catch (error) {
      console.log('push -- error', value, error);
    }
  }

  // Add data to levelDB with value
  async getLength() {
    const self = this;
    try {
      const data = await self.getData();
      return data.length;
    } catch (error) {
      console.log('getLength -- error', key, value, error);
    }
  }
}

module.exports = { Database };

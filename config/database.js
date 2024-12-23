const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

async function initDatabase() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData = {
      admin: [{
        username: '1379459026',
        password: '18460391861'
      }],
      passwords: []
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

async function readDB() {
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

const db = {
  async get(table, query) {
    const data = await readDB();
    return data[table].find(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
  },

  async all(table) {
    const data = await readDB();
    return data[table];
  },

  async run(operation, params) {
    const data = await readDB();
    
    switch (operation) {
      case 'INSERT_PASSWORD': {
        const { category, chain, site, username, password } = params;
        const id = Date.now();
        data.passwords.push({ id, category, chain, site, username, password });
        break;
      }
      
      case 'UPDATE_PASSWORD': {
        const { id, category, chain, site, username, password } = params;
        const index = data.passwords.findIndex(p => p.id === Number(id));
        if (index !== -1) {
          data.passwords[index] = { id: Number(id), category, chain, site, username, password };
        }
        break;
      }
      
      case 'DELETE_PASSWORD': {
        const { id } = params;
        data.passwords = data.passwords.filter(p => p.id !== Number(id));
        break;
      }
    }
    
    await writeDB(data);
    return { id: params.id, changes: 1 };
  }
};

initDatabase().catch(console.error);

module.exports = db;
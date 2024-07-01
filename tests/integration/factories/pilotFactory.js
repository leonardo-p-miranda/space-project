const { v4: uuidv4 } = require('uuid');
const db = require('../../../controllers/db');

const createPilot = async (data) => {
  const { name, age, credits, location } = data;
  const certification = uuidv4();

  const query = `INSERT INTO pilot VALUES ('${certification}', '${name}', ${age}, ${credits}, '${location}')`;

  await db.query(query);

  return { certification, name, age, credits, location };
};

module.exports = {
  createPilot,
};

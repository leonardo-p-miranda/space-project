const { v4: uuidv4 } = require('uuid');
const db = require('../../../controllers/db');

const createShip = async (data) => {
  const { fuel_capacity, fuel_level, weight_capacity, pilot_id } = data;
  const id = uuidv4();

  const query = `INSERT INTO ship (id, fuel_capacity, fuel_level, weight_capacity, pilot_id) 
                 VALUES ('${id}', '${fuel_capacity}', ${fuel_level}, ${weight_capacity}, '${pilot_id}')`;

  await db.query(query);

  return { id, fuel_capacity, fuel_level, weight_capacity, pilot_id };
};

module.exports = {
  createShip,
};

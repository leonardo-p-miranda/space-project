const { v4: uuidv4 } = require("uuid");

const db = require("./db.js");

const getShips = async (_, res, next) => {
  try {
    res.json(await db.query(`SELECT * FROM ship`));
  } catch (err) {
    console.error(`Error while getting ships`, err.message);
    next(err);
  }
};

const createShip = async (req, res, next) => {
  try {
    const { fuel_capacity, fuel_level, weight_capacity, pilot_id } = req.body;
    id = uuidv4();

    res.json(
      await db.query(
        `INSERT INTO ship VALUES ('${id}', '${fuel_capacity}',  ${fuel_level}, ${weight_capacity}, ${pilot_id})`
      )
    );
  } catch (err) {
    console.error(`Error while creating ship`, err.message);
    next(err);
  }
};

const getShip = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`SELECT * FROM ship WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while getting ship with id ${id}`, err.message);
    next(err);
  }
};

const deleteShip = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`DELETE FROM ship WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while deleting ship with id ${id}`, err.message);
    next(err);
  }
};

const updateShip = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { fuel_capacity, fuel_level, weight_capacity, pilot_id } = req.body;
    res.json(
      await db.query(
        `UPDATE ship
        SET fuel_capacity = '${fuel_capacity}',
        fuel_level = ${fuel_level},
        weight_capacity = ${weight_capacity},
        pilot_id = ${pilot_id}
        WHERE id = '${id}'`
      )
    );
  } catch (err) {
    console.error(`Error while updating ship with id ${id}`, err.message);
    next(err);
  }
};

module.exports = {
  createShip,
  getShips,
  getShip,
  deleteShip,
  updateShip,
};

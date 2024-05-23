const { v4: uuidv4 } = require("uuid");

const db = require("./db.js");

const getContracts = async (_, res, next) => {
  try {
    res.json(await db.query(`SELECT * FROM contract`));
  } catch (err) {
    console.error(`Error while getting contracts`, err.message);
    next(err);
  }
};

const createContract = async (req, res, next) => {
  try {
    const { description, origin_planet, destination_planet, value, payload } =
      req.body;
    id = uuidv4();

    res.json(
      await db.query(
        `INSERT INTO contract VALUES ('${description}', '${origin_planet}', '${destination_planet}', ${value}, ${payload}, ${id}, false)`
      )
    );
  } catch (err) {
    console.error(`Error while creating contract`, err.message);
    next(err);
  }
};

const getContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`SELECT * FROM contract WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while getting contract with id ${id}`, err.message);
    next(err);
  }
};

const deleteContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`DELETE FROM contract WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while deleting contract with id ${id}`, err.message);
    next(err);
  }
};

const updateContract = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { description, origin_planet, destination_planet, value } = req.body;
    res.json(
      await db.query(
        `UPDATE contract
        SET description = '${description}',
        origin_planet = ${origin_planet},
        destination_planet = ${destination_planet},
        value = ${value}
        WHERE id = '${id}'`
      )
    );
  } catch (err) {
    console.error(`Error while updating contract with id ${id}`, err.message);
    next(err);
  }
};

module.exports = {
  createContract,
  getContracts,
  getContract,
  deleteContract,
  updateContract,
};

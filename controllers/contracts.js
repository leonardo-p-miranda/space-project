const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const getContracts = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM contract');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createContract = async (req, res, next) => {
  try {
    const {
      description,
      origin_planet,
      destination_planet,
      value,
      payload,
      status = 'pending',
    } = req.body;
    const id = uuidv4();
    const query = `
      INSERT INTO contract (description, origin_planet, destination_planet, value, payload, id, status)
      VALUES ('${description}', '${origin_planet}', '${destination_planet}', ${value}, '${payload}', '${id}', '${status}')
    `;
    await db.query(query);
    res.json({ id });
  } catch (err) {
    console.error(`Error while creating contract`, err.message);
    next(err);
  }
};

const getContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await db.query(
      `SELECT * FROM contract WHERE id = '${id}'`
    );
    res.json(contract);
  } catch (err) {
    console.error(`Error while getting contract with id ${id}`, err.message);
    next(err);
  }
};

const deleteContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM contract WHERE id = '${id}'`);
    res.json({});
  } catch (err) {
    console.error(`Error while deleting contract with id ${id}`, err.message);
    next(err);
  }
};

const updateContract = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { description, origin_planet, destination_planet, value, status } =
      req.body;
    const query = `
      UPDATE contract
      SET description = '${description}', origin_planet = '${origin_planet}', destination_planet = '${destination_planet}', value = ${value}, status = '${status}'
      WHERE id = '${id}'
    `;
    await db.query(query);
    res.json({});
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

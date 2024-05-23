const { v4: uuidv4 } = require("uuid");

const db = require("./db.js");

const getResources = async (_, res, next) => {
  try {
    res.json(await db.query(`SELECT * FROM resource`));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
};

const createResource = async (req, res, next) => {
  try {
    const { name, weight } = req.body;
    id = uuidv4();
    res.json(
      await db.query(
        `INSERT INTO resource VALUES ('${id}', '${name}', ${weight})`
      )
    );
  } catch (err) {
    console.error(`Error while getting resources`, err.message);
    next(err);
  }
};

const getResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`SELECT * FROM resource WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while getting resource with id ${id}`, err.message);
    next(err);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`DELETE FROM resource WHERE id = '${id}'`));
  } catch (err) {
    console.error(`Error while deleting resource with id ${id}`, err.message);
    next(err);
  }
};

const updateResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { name, weight } = req.body;
    res.json(
      await db.query(
        `UPDATE resource
        SET name = '${name}',
        weight = ${weight}
        WHERE id = '${id}'`
      )
    );
  } catch (err) {
    console.error(`Error while updating resource with id ${id}`, err.message);
    next(err);
  }
};

module.exports = {
  createResource,
  getResources,
  getResource,
  deleteResource,
  updateResource,
};
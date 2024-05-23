const db = require("./db");
const { getContracts } = require("../controllers/contracts.js");
const { router: contractsRouter } = require("../routes/contracts.js");

const getPilots = async (_, res, next) => {
  try {
    res.json(await db.query(`SELECT * FROM pilot`));
  } catch (err) {
    console.error(`Error while getting pilots `, err.message);
    next(err);
  }
};

const getPilot = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(
      await db.query(`SELECT * FROM pilot WHERE certification = '${id}'`)
    );
  } catch (err) {
    console.error(`Error while getting pilot with id ${id}`, err.message);
    next(err);
  }
};

const createPilot = async (req, res, next) => {
  try {
    const { certification, name, age, credits, location } = req.body;
    res.json(
      await db.query(
        `INSERT INTO pilot VALUES ('${certification}', '${name}', ${age}, ${credits}, '${location}')`
      )
    );
  } catch (err) {
    console.error(`Error while creating pilot`, err.message);
    next(err);
  }
};

const deletePilot = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await db.query(`DELETE FROM pilot WHERE id = '${id}'`));
  } catch (err) {
    console.error(` while deleting pilot with id ${id}`, err.message);
    next(err);
  }
};

const updatePilot = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { certification, name, age, credits, location } = req.body;
    res.json(
      await db.query(
        `UPDATE pilot
        SET certification = '${certification}',
        name = '${name}',
        age = ${age},
        credits = ${credits},
        location = '${location}'
        WHERE certification = '${id}'`
      )
    );
  } catch (err) {
    console.error(`Error while updating pilot with id ${id}`, err.message);
    next(err);
  }
};

const refillFuel = async (req, res, next) => {
  const { id } = req.params;

  const [{ credits }] = await db.query(
    `SELECT credits FROM pilot WHERE certification = ${id}`
  );

  console.log(credits);

  const newCredits = credits - 7;

  if (newCredits < 0) throw Error("Not enough credits");

  Promise.all([
    db.query(
      `UPDATE pilot
         SET credits = '${newCredits}'
         WHERE certification = '${id}'`
    ),
    db.query(
      `UPDATE ship 
          SET fuel_level = 100
          WHERE pilot_id = '${id}'`
    ),
  ])
    .then(function (result) {
      res.json(result);
    })
    .catch((e) => next(e));
};

const processTransaction = async (userId) => {
  const contracts = await db.query(`SELECT * FROM contract`);

  let foundContract = contracts.find(
    (contract) => contract.accepted_by == userId
  );

  const [{ weight_capacity: capacity }] = await db.query(
    `SELECT weight_capacity
      FROM pilot INNER JOIN ship
      ON pilot.certification = ship.pilot_id
      WHERE certification = '${userId}'`
  );

  const [{ weight }] = await db.query(
    `SELECT weight
      FROM contract INNER JOIN resource
      ON contract.payload = resource.id
      WHERE contract.id = '${foundContract.id}'`
  );

  if (capacity < weight) {
    console.error(`Weight not supported, wait for another trip`);

    return;
  }

  Promise.all([
    db.query(
      `UPDATE contract
    SET status = 1
    WHERE id = '${foundContract.id}'`
    ),
    db.query(
      `UPDATE pilot 
    SET credits = credits + ${foundContract.value}
    WHERE certification = '${userId}'`
    ),
  ])
    .then(function (result) {
      res.json(result);
    })
    .catch((e) => console.error(e));
};

const acceptContract = async (req, res, next) => {
  const { id, contract: contractId } = req.params;

  console.log(id, contractId);

  try {
    res.json(
      await db.query(
        `UPDATE contract
        SET accepted_by = '${id}'
        WHERE id = '${contractId}'`
      )
    );
  } catch (err) {
    console.error(`Error while accepting contract ${id}`, err.message);
    next(err);
  }
};

const travelBetweenPlanets = async (req, res, next) => {
  const { id, newLocation } = req.params;
  try {
    const [pilotInfo] = await db.query(
      `SELECT location, fuel_level
      FROM pilot INNER JOIN ship
      ON pilot.certification = ship.pilot_id
      WHERE certification = '${id}'`
    );


    const { location, fuel_level: fuelLevel } = pilotInfo;

    const [constrains] = await db.query(
      `SELECT travel_constrains FROM planet WHERE id = '${location}'`
    );

    const travelConstrain = constrains.travel_constrains[newLocation];

    newFuel = fuelLevel - travelConstrain;

    if (newFuel < 0) throw Error("Not enough fuel");

    if (newLocation != location && travelConstrain != -1) {
      Promise.all([
        db.query(
          `UPDATE pilot
          SET location = '${newLocation}'
          WHERE certification = '${id}'`
        ),
        db.query(
          `UPDATE ship 
            SET fuel_level = ${newFuel}
            WHERE pilot_id = '${id}'`
        ),
        processTransaction(id),
      ])
        .then(function (result) {
          res.json(result);
        })
        .catch((e) => console.error(e));
    } else {
      throw Error("Route blocked");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPilot,
  getPilots,
  getPilot,
  deletePilot,
  updatePilot,
  travelBetweenPlanets,
  refillFuel,
  acceptContract,
};

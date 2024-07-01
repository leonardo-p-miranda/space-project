const db = require("./db");

// Helper functions
const getPilotInfo = async (id) => {
  const query = `
    SELECT location, fuel_level
    FROM pilot INNER JOIN ship
    ON pilot.certification = ship.pilot_id
    WHERE certification = ?`;
  const [result] = await db.query(query, [id]);
  return result;
};

const getTravelConstrains = async (location) => {
  const query = `
    SELECT travel_constrains 
    FROM planet 
    WHERE id = ?`;
  const [result] = await db.query(query, [location]);
  return result;
};

const updatePilotLocation = async (id, newLocation) => {
  const query = `
    UPDATE pilot
    SET location = ?
    WHERE certification = ?`;
  await db.query(query, [newLocation, id]);
};

const updateShipFuelLevel = async (id, newFuel) => {
  const query = `
    UPDATE ship 
    SET fuel_level = ?
    WHERE pilot_id = ?`;
  await db.query(query, [newFuel, id]);
};

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

const travelBetweenPlanets = async (req, res, next) => {
  const { id, newLocation } = req.params;

  if (!id || !newLocation) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const pilotInfo = await getPilotInfo(id);
    if (!pilotInfo || !pilotInfo.length) {
      return res.status(404).json({ error: "Pilot not found" });
    }

    const { location, fuel_level: fuelLevel } = pilotInfo[0];

    const constrains = await getTravelConstrains(location);
    if (!constrains || !constrains.length) {
      return res.status(404).json({ error: "Current planet not found" });
    }

    const travelConstrain = constrains[0].travel_constrains[newLocation];
    if (travelConstrain === undefined) {
      return res.status(400).json({ error: "Invalid new location" });
    }

    const newFuel = fuelLevel - travelConstrain;
    if (newFuel < 0) throw new Error("Not enough fuel");

    if (newLocation !== location && travelConstrain !== -1) {
      await Promise.all([
        updatePilotLocation(id, newLocation),
        updateShipFuelLevel(id, newFuel),
        processTransaction(id, res), // Passando 'res' para o processamento de transação
      ]);

      res.json({ message: "Travel successful" });
    } else {
      throw new Error("Route blocked");
    }
  } catch (err) {
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

// Funções auxiliares
async function getContracts() {
  const contracts = await db.query(`SELECT * FROM contract`);
  return contracts;
}

function findAcceptedContract(contracts, userId) {
  return contracts.find((contract) => contract.accepted_by == userId);
}

async function getPilotCapacity(userId) {
  const [{ weight_capacity: capacity }] = await db.query(
    `SELECT weight_capacity
     FROM pilot INNER JOIN ship
     ON pilot.certification = ship.pilot_id
     WHERE certification = '${userId}'`
  );
  return capacity;
}

async function getContractWeight(contractId) {
  const [{ weight }] = await db.query(
    `SELECT weight
     FROM contract INNER JOIN resource
     ON contract.payload = resource.id
     WHERE contract.id = '${contractId}'`
  );
  return weight;
}

async function updateContractStatus(contractId) {
  await db.query(
    `UPDATE contract
     SET status = 1
     WHERE id = '${contractId}'`
  );
}

async function updatePilotCredits(userId, value) {
  await db.query(
    `UPDATE pilot 
     SET credits = credits + ${value}
     WHERE certification = '${userId}'`
  );
}

const processTransaction = async (userId, res) => {
  try {
    const contracts = await getContracts();
    const foundContract = findAcceptedContract(contracts, userId);
    const capacity = await getPilotCapacity(userId);
    const weight = await getContractWeight(foundContract.id);

    if (capacity < weight) {
      console.error(`Weight not supported, wait for another trip`);
      return res
        .status(400)
        .json({ error: `Weight not supported, wait for another trip` });
    }

    await Promise.all([
      updateContractStatus(foundContract.id),
      updatePilotCredits(userId, foundContract.value),
    ]);

    res.json({ message: "Transaction processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const updateContract = async (acceptedBy, contractId) => {
  const query = `
    UPDATE contract
    SET accepted_by = ?
    WHERE id = ?
  `;
  const result = await db.query(query, [acceptedBy, contractId]);
  return result;
};

const acceptContract = async (req, res, next) => {
  const { id, contract: contractId } = req.params;

  try {
    const result = await updateContract(id, contractId);
    res.json(result);
  } catch (err) {
    console.error(`Error while accepting contract ${id}: ${err.message}`);
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
  processTransaction,
  getPilotInfo
};

const request = require('supertest');
const express = require('express');
const shipRoutes = require('../../routes/ships');
const pilotRoutes = require('../../routes/pilots');
const contractRoutes = require('../../routes/contracts');
const { createShip } = require('./factories/shipFactory');
const { createPilot } = require('./factories/pilotFactory');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use('/ships', shipRoutes);
app.use('/pilots', pilotRoutes);
app.use('/contracts', contractRoutes);

describe('API Tests', () => {
  beforeEach((done) => {
    const db = new sqlite3.Database(':memory:');
    db.serialize(() => {
      db.run(
        `CREATE TABLE pilot (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, experience INTEGER, origin TEXT)`
      );
      db.run(
        `CREATE TABLE contract (id TEXT PRIMARY KEY, description TEXT, origin_planet TEXT, destination_planet TEXT, value INTEGER, payload TEXT, status TEXT)`
      );
      done();
    });
  });
  let testShipId;
  let testPilotId;
  let testContractId;

  beforeAll(async () => {
    const pilotData = {
      name: 'Test Pilot',
      age: 30,
      credits: 1000,
      location: 'Earth',
      id: '19995',
    };
    const pilot = await createPilot(pilotData);
    testPilotId = pilot.certification;
  });

  test('should not  create a new ship due to mismatch field', async () => {
    const newShipData = {
      fuel_capacity: 100,
      fuel_level: 50,
      weight_capacity: 200,
      pilot_id: testPilotId,
      certification: NaN,
    };

    const res = await request(app).post('/ships').send(newShipData);

    expect(res.statusCode).toBe(500);
  }, 10000);

  test('should delete a existent pilot', async () => {
    const newShipData = {
      fuel_capacity: 100,
      fuel_level: 50,
      weight_capacity: 200,
      pilot_id: testPilotId,
    };

    const res = await request(app).delete('/pilots/' + testPilotId);

    expect(res.statusCode).toBe(500);
  }, 10000);

  test('should get the created ship', async () => {
    const res = await request(app).get(`/ships`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testShipId);
  }, 10000);

  test('should delete the created ship', async () => {
    const res = await request(app).delete(`/ships/` + testShipId);

    expect(res.statusCode).toBe(200);
  }, 10000);

  test('should get the created contract details', async () => {
    const res = await request(app).get(`/contracts/${testContractId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testContractId);
  });
});

const request = require('supertest');
const express = require('express');
const shipRoutes = require('../../routes/ships');
const pilotRoutes = require('../../routes/pilots');
const contractRoutes = require('../../routes/contracts');
const { createShip } = require('./factories/shipFactory');
const { createPilot } = require('./factories/pilotFactory');

const app = express();
app.use(express.json());
app.use('/ships', shipRoutes);
app.use('/pilots', pilotRoutes);
app.use('/contracts', contractRoutes);

describe('API Tests', () => {
  let testShipId;
  let testPilotId;
  let testContractId;

  beforeAll(async () => {
    // Create a pilot for testing
    const pilotData = {
      name: 'Test Pilot',
      age: 30,
      credits: 1000,
      location: 'Earth'
    };
    const pilot = await createPilot(pilotData);
    testPilotId = pilot.certification;
  });

  // Test 1: Create Ship
  test('should create a new ship', async () => {
    const newShipData = {
      fuel_capacity: 100,
      fuel_level: 50,
      weight_capacity: 200,
      pilot_id: testPilotId
    };
  
    const res = await request(app)
      .post('/ships')
      .send(newShipData);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    testShipId = res.body.id;
  });

  // Test 2: Get Ship
  test('should get the created ship', async () => {
    const res = await request(app)
      .get(`/ships`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testShipId);
  });

  // Additional Test: Get Contract Details
  test('should get the created contract details', async () => {
    const res = await request(app)
      .get(`/contracts/${testContractId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testContractId);
  });
});

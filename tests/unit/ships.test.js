const express = require('express');
const request = require('supertest');

const {
  createShip,
  getShips,
  getShip,
  deleteShip,
  updateShip,
} = require('../../controllers/ships');

const db = require('../../controllers/db');

jest.mock('../../controllers/db');

const app = express();
app.use(express.json());

app.get('/ships', getShips);
app.post('/ship', createShip);
app.get('/ship/:id', getShip);
app.delete('/ship/:id', deleteShip);
app.put('/ship/:id', updateShip);

describe('Ships Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getShip should return a specific ship', async () => {
    const mockShipId = '123';
    const mockShip = { id: mockShipId, fuel_capacity: 100, fuel_level: 50 };

    db.query.mockResolvedValue([mockShip]);

    const response = await request(app).get(`/ship/${mockShipId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockShip]);
    expect(db.query).toHaveBeenCalledWith(
      `SELECT * FROM ship WHERE id = '${mockShipId}'`
    );
  });

  test('updateShip should update a specific ship', async () => {
    const mockShipId = '123';
    const mockUpdatedShip = {
      fuel_capacity: 150,
      fuel_level: 75,
      weight_capacity: 600,
      pilot_id: 'pilot456',
    };

    db.query.mockResolvedValue({ affectedRows: 1 });

    const response = await request(app)
      .put(`/ship/${mockShipId}`)
      .send(mockUpdatedShip);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ affectedRows: 1 });
  });
});

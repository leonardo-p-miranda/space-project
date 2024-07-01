const request = require('supertest');
const express = require('express');
const {
  createContract,
  getContracts,
  getContract,
  deleteContract,
  updateContract,
} = require('../../controllers/contracts');
const db = require('../../controllers/db');

jest.mock('../../controllers/db');

const app = express();
app.use(express.json());

app.get('/contracts', getContracts);
app.post('/contract', createContract);
app.get('/contract/:id', getContract);
app.delete('/contract/:id', deleteContract);
app.put('/contract/:id', updateContract);

describe('Contracts Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getContract should return a specific contract', async () => {
    const mockContractId = '123';
    const mockContract = { id: mockContractId, description: 'Test contract' };

    db.query.mockResolvedValue([mockContract]);

    const response = await request(app).get(`/contract/${mockContractId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockContract]);
    expect(db.query).toHaveBeenCalledWith(
      `SELECT * FROM contract WHERE id = '${mockContractId}'`
    );
  });

  test('deleteContract should delete a specific contract', async () => {
    const mockContractId = '123';

    db.query.mockResolvedValueOnce();
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const response = await request(app).delete(`/contract/${mockContractId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(db.query).toHaveBeenCalledWith(
      `DELETE FROM contract WHERE id = '${mockContractId}'`
    );
  });

  test('updateContract should update a specific contract', async () => {
    const mockContractId = '123';
    const mockRequestBody = {
      description: 'Updated contract',
      origin_planet: 'Mars',
      destination_planet: 'Jupiter',
      value: 800,
      status: 'completed',
    };

    db.query.mockResolvedValueOnce();
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const response = await request(app)
      .put(`/contract/${mockContractId}`)
      .send(mockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });
});

const { travelBetweenPlanets } = require('../../controllers/pilots');

test('should travel between planets successfully', async () => {
  const req = { params: { id: '1', newLocation: 'Mars' } };
  const res = { json: jest.fn() };
  const next = jest.fn();

  await travelBetweenPlanets(req, res, next);

  expect(res.json).toHaveBeenCalledWith({ message: 'Travel successful' });
});

test('should return error for missing parameters', async () => {
  const req = { params: {} };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await travelBetweenPlanets(req, res, next);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Missing required parameters',
  });
});

test('should return error if pilot not found', async () => {
  const req = { params: { id: '999', newLocation: 'Mars' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await travelBetweenPlanets(req, res, next);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Pilot not found' });
});

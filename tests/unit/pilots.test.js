const request = require("supertest");
const express = require("express");
const {
  createPilot,
  getPilots,
  getPilot,
  deletePilot,
  updatePilot,
  travelBetweenPlanets,
  refillFuel,
  acceptContract,
} = require("../../controllers/pilots");
const db = require("../../controllers/db");

jest.mock("../../controllers/db");

const app = express();
app.use(express.json());

app.post("/pilot", createPilot);
app.get("/pilots", getPilots);
app.get("/pilot/:id", getPilot);
app.delete("/pilot/:id", deletePilot);
app.put("/pilot/:id", updatePilot);
app.post("/travel/:id/:newLocation", travelBetweenPlanets);
app.post("/refill/:id", refillFuel);
app.post("/acceptContract/:id/:contract", acceptContract);

describe("Controller tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createPilot should create a new pilot", async () => {
    db.query.mockResolvedValue({ affectedRows: 1 });
    const response = await request(app)
      .post("/pilot")
      .send({ certification: "123", name: "John Doe", age: 30, credits: 100, location: "Earth" });
    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith(
      `INSERT INTO pilot VALUES ('123', 'John Doe', 30, 100, 'Earth')`
    );
  });

  test("getPilots should return all pilots", async () => {
    db.query.mockResolvedValue([{ id: 1, name: "John Doe" }]);
    const response = await request(app).get("/pilots");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "John Doe" }]);
    expect(db.query).toHaveBeenCalledWith(`SELECT * FROM pilot`);
  });

  test("getPilot should return a single pilot", async () => {
    db.query.mockResolvedValue([{ id: 1, name: "John Doe" }]);
    const response = await request(app).get("/pilot/123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "John Doe" }]);
    expect(db.query).toHaveBeenCalledWith(`SELECT * FROM pilot WHERE certification = '123'`);
  });

  test("deletePilot should delete a pilot", async () => {
    db.query.mockResolvedValue({ affectedRows: 1 });
    const response = await request(app).delete("/pilot/123");
    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith(`DELETE FROM pilot WHERE id = '123'`);
  });

  test("updatePilot should update a pilot's information", async () => {
    db.query.mockResolvedValue({ affectedRows: 1 });
    const response = await request(app)
      .put("/pilot/123")
      .send({ certification: "123", name: "John Doe", age: 31, credits: 200, location: "Mars" });
    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith(
      `UPDATE pilot
        SET certification = '123',
        name = 'John Doe',
        age = 31,
        credits = 200,
        location = 'Mars'
        WHERE certification = '123'`
    );
  });
});
process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let itemOne= { name: "Pickles",
                price: 2.00 };

beforeEach(function () {
  items.push(itemOne);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
  });

describe("GET /items", () => {
    test("Get all items", async () => {
      const res = await request(app).get("/items");
      expect(res.statusCode).toBe(200)

      expect(res.body).toEqual({ items: [ { name: 'Pickles', price: 2 } ] })
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
      const res = await request(app).get(`/items/${itemOne.name}`);
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ item: { name: 'Pickles', price: 2 } })
    })
    test("Responds with 404 for invalid item", async () => {
      const res = await request(app).get(`/items/popsicles`);
      expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
      const res = await request(app).post("/items").send({ name: "Biscuits", price: 4.5 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ added: { name: "Biscuits", price: 4.5 } });
    })
    test("Responds with 400 if price is missing", async () => {
      const res = await request(app).post("/items").send({name: "Biscuits"});
      expect(res.statusCode).toBe(400);
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({price: 1.5});
        expect(res.statusCode).toBe(400);
      })
  })
  
describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
      const res = await request(app).patch(`/items/${itemOne.name}`).send({ name: "Eggs" });
      expect(res.statusCode).toBe(200);
      console.log(res.body)
      expect(res.body).toEqual({ updated: { name: "Eggs"} });
    })
    test("Responds with 404 for invalid name", async () => {
      const res = await request(app).patch(`/items/bread`).send({ name: "Milk" });
      expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
      const res = await request(app).delete(`/items/${itemOne.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/ham`);
      expect(res.statusCode).toBe(404);
    })
  })
const expect = require("chai").expect;
const request = require("supertest");
const Panda  = require("../app/models/panda");
const Category = require("../app/models/category");
const app = require("../app/app");
const mongoose = require("../config/db");

let pandaId = '', categoryId = '';

describe("CRUD", () => {
  describe("api/panda", () => {
    before(async () => {
      await Panda.deleteMany({});
    });
  
    describe("GET /", () => {
      it("Should return all pandas", async () => {
        const pandas = [
          { name: "panda1", skill: "skill1"},
          { name: "panda2", skill: "skill2"}
        ];
        await Panda.insertMany(pandas);
        const res = await request(app).get("/api/panda");
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
      });
    });
  
    describe("GET/:id", () => {
      it("Should return a panda if the passed id is valid", async () => {
        const panda = new Panda({
          name: "ProPanda",
          skill: "backend"
        });
        await panda.save();
        const res = await request(app).get(`/api/panda/${panda._id}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("name", panda.name);
      });
  
      it("Should return 400 error when invalid id is passed", async () => {
        const res = await request(app).get("/api/panda/1");
        expect(res.status).to.equal(400);
      });
  
      it("Should return 404 error when valid id is passed but does not exist", async () => {
        const res = await request(app).get("/api/panda/5f43ef20c1d4a133e4628181");
        expect(res.status).to.equal(404);
      });
    });
  
    describe("POST /", () => {
      it("Should return panda when the request body is valid", async () => {
        const res = await request(app)
          .post("/api/panda")
          .send({
            name: "pandaName",
            skill: "pandaSkill"
          });
        const data = res.body;
        expect(res.status).to.equal(200);
        expect(data).to.have.property("_id");
        expect(data).to.have.property("name", "pandaName");
        expect(data).to.have.property("skill", "pandaSkill");
  
        const panda = await Panda.findOne({ skill: 'pandaSkill' });
        expect(panda.name).to.equal('pandaName');
        expect(panda.skill).to.equal('pandaSkill');
      });
    });
  
    describe("PUT /:id", () => {
      it("Should update an existing panda and return 200", async() => {
          const panda = new Panda({
              name: "oldName",
              skill: "oldSkill"
          });
          await panda.save();
  
          const res = await request(app)
              .put("/api/panda/" + panda._id)
              .send({
                  name: "newName",
                  skill: "newSkill"
              });
  
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("name", "newName");
          expect(res.body).to.have.property("skill", "newSkill");
      });
    });
  
    describe("DELETE /:id", () => {
      it("Should delete the panda of the requested id and return response 200", async () => {
        const panda = new Panda({
          name: "namePandaToBeDeleted",
          skill: "skillPandaToBeDeleted"
        });
        await panda.save();
        pandaId = panda._id;
        const res = await request(app).delete(`/api/panda/${pandaId}`);
        expect(res.status).to.be.equal(200);
      });
  
      it("Should return 404 when deleted panda is requested", async () => {
        let res = await request(app).get(`/api/panda/${pandaId}`);
        expect(res.status).to.be.equal(404);
      });
    });
  });
  
  describe("api/category", () => {
    before(async () => {
      await Category.deleteMany({});
    });
  
    after(async () => {
      mongoose.disconnect();
    });
  
    describe("GET /", () => {
      it("Should return all categorys", async () => {
        const categorys = [
          { name: "category1", type: "type1", age: 50},
          { name: "category2", type: "type2", age: 70},
        ];
        await Category.insertMany(categorys);
        const res = await request(app).get("/api/category");
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
      });
    });
  
    describe("GET/:id", () => {
      it("Should return a category if the passed id is valid", async () => {
        const category = new Category({ 
            name: "Pro", 
            type: "backend", 
            age: 50
          });
        await category.save();
        const res = await request(app).get(`/api/category/${category._id}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("name", category.name);
      });
  
      it("Should return 400 error when invalid id is passed", async () => {
        const res = await request(app).get("/api/category/1");
        expect(res.status).to.equal(400);
      });
  
      it("Should return 404 error when valid id is passed but does not exist", async () => {
        const res = await request(app).get("/api/category/5f43ef20c1d4a133e4628181");
        expect(res.status).to.equal(404);
      });
    });
  
    describe("POST /", () => {
      it("Should return category when the request body is valid", async () => {
        const res = await request(app)
          .post("/api/category")
          .send({ 
              name: "categoryName",
              type: "categoryType", 
              age: 50
          });
          const data = res.body;
          expect(res.status).to.equal(200);
          expect(data).to.have.property("_id");
          expect(data).to.have.property("name", "categoryName");
          expect(data).to.have.property("type", "categoryType");
          expect(data).to.have.property("age", 50);
  
          const category = await Category.findOne({ type: 'categoryType' });
          expect(category.name).to.equal('categoryName');
          expect(category.type).to.equal('categoryType');
          expect(category.age).to.equal(50);
      });
    });
  
    describe("PUT /:id", () => {
      it("Should update an existing category and return 200", async() => {
          const category = new Category({
              name: "oldName",
              type: "oldType",
              age: 50
          });
          await category.save();
  
          const res = await request(app)
              .put("/api/category/" + category._id)
              .send({
                  name: "newName",
                  type: "newType",
                  age: 60
              });
  
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("name", "newName");
          expect(res.body).to.have.property("type", "newType");
          expect(res.body).to.have.property("age", 60);
      });
    });
  
    describe("DELETE /:id", () => {
      it("Should delete the category of the requested id and return response 200", async () => {
        const category = new Category({
          name: "categoryName",
          type: "categoryType",
          age: 50
        });
        await category.save();
        categoryId = category._id;
        const res = await request(app).delete(`/api/category/${categoryId}`);
        expect(res.status).to.be.equal(200);
      });
  
      it("Should return 404 when deleted category is requested", async () => {
        let res = await request(app).get(`/api/category/${categoryId}`);
        expect(res.status).to.be.equal(404);
      });
    });
  });
});
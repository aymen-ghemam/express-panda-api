const expect = require("chai").expect;
const request = require("supertest");
const Panda  = require("../app/models/panda");
const app = require("../app/app");
const mongoose = require('mongoose');
// const config = require('../config');
const env = process.env.NODE_ENV || 'development';

let pandaId = '';

describe("api/panda", () => {
  before(async () => {
    await Panda.deleteMany({});
  });

  after(async () => {
    // mongoose.disconnect();
  });

//   it("should connect and disconnect to mongodb", async () => {
//       // console.log(mongoose.connection.states);
//       mongoose.disconnect();
//       mongoose.connection.on('disconnected', () => {
//         expect(mongoose.connection.readyState).to.equal(0);
//       });
//       mongoose.connection.on('connected', () => {
//         expect(mongoose.connection.readyState).to.equal(1);
//       });
//       mongoose.connection.on('error', () => {
//         expect(mongoose.connection.readyState).to.equal(99);
//       });

//       await mongoose.connect(config.db[env], config.dbParams);
//   });

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
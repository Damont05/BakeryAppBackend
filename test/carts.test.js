import { expect } from "chai";
import supertest from "supertest";
import { config } from '../src/config/config.js'
import { describe, it, after } from "mocha";
import mongoose from "mongoose";


let url = config.MONGO_URL;
let dbName = config.DBNAME;


await mongoose.connect(url,{dbName});


const requester = supertest("http://localhost:8080");

describe("Test project ", async function () {
  this.timeout(5000);


  

  describe("Test module Cart", async function () {
  
    it("ruta /api/carts/:id, METHOD:GET, permite obtener un carrito específico mediante su _id", async () => {
     
      const response = await requester
        .get("/api/cart/65f22a174fc25ba1e1bf3a1a")
              
      expect(response.status).to.equal(200);
      
    });


  });

  describe("Test module User", async function () {
     
    it("ruta /api/user, METHOD:GET, obtener todos los usuarios", async () => {
     
      const response = await requester
        .get("/api/user")
              
      expect(response.status).to.equal(200);
      
    });


  });

});
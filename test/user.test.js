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

describe("Test module Login and Register", async function () {

    after(async()=>{
      let resultado=await mongoose.connection.collection("users").deleteMany({email:"prueba2@gmail.com"})
    })


    it("ruta /api/sessions/login, METHOD:POST, redirige al usuario a la página de productos después de iniciar sesión correctamente", async () => {
      
      const response = await requester.post("/api/sessions/login")
        .send({ email: "prueba@gmail.com", password: "123" });
  
      expect(response.status).to.equal(302); 
      expect(response.header.location).to.equal("/products");
    });


    it("ruta /api/sessions/register, METHOD:POST, redirige al usuario a la página de login después de registrarse correctamente", async () => {
      

      const requestData = {
        first_name: "Prueba2 Nom", 
        last_name: "Prueba2 Ape",
        email: "prueba2@gmail.com",
        password: "1234",
        age: "60",
      };

      const response = await requester
      .post("/api/sessions/register")
      .send(requestData);
  
      expect(response.status).to.equal(302); 
      expect(response.header.location).to.equal("/login?mensaje=Usuario%20prueba2@gmail.com%20registrado%20correctamente");
    });

  });
});
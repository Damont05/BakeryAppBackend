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

  describe("Test module products", async function () {
 
    after(async()=>{
      let resultado=await mongoose.connection.collection("products").deleteMany({code:"P018"})
      console.log(resultado)
    })

    
    it("ruta /api/products, METHOD:GET, permite obtener información de un producto específico mediante su _id", async () => {
     
      const response = await requester.get("/api/products");
      
      expect(response.status).to.equal(200);
    })

     it("ruta /api/products, METHOD:POST, devuelve un status 201 de creado y un mensaje de producto creado", async function () {
      
      const requestData = {
        code: "P018", 
        title: "Lasaña Vegetariana",
        description: "1 porcion",
        price: 1800,
        stock: 60,
        category: "P",
        thumbnail: "https://enharinado.com/wp-content/uploads/2017/03/tunjitas.jpg",
        owner: "user",
      };
      
      const response = await requester
        .post("/api/products")
        .send(requestData);
  
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("message").that.equals("Product created");
    }); 
    
  });

  describe("Test module Login and Register", async function () {

    after(async()=>{
      let resultado=await mongoose.connection.collection("users").deleteMany({email:"prueba2@gmail.com"})
      console.log(resultado)
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
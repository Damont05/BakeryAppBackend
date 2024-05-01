import { expect } from "chai";
import supertest from "supertest";
import { config } from '../src/config/config.js'
import { describe, it, after } from "mocha";
import mongoose from "mongoose";


let url = config.MONGO_URL;
let dbName = config.DBNAME;


await mongoose.connect(url, { dbName });


const requester = supertest("http://localhost:8080");

describe("Test project ", async function () {
    this.timeout(5000);

    describe("Test module products", async function () {

        after(async () => {
            let resultado = await mongoose.connection.collection("products").deleteMany({ code: "P018" })
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
});
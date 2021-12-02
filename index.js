
// BLOQUE IMPORTACIONES
const express = require('express')
const path = require('path')
const { MongoClient, ObjectId } = require('mongodb')
const { response } = require('express')
const cors = require('cors')


// BLOQUE VARIABLES
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000
//const db = require('./connections/mongodb')
const clienteDB = new MongoClient("mongodb://localhost:27017/formacion")
let db = null;
let colecciones = {};
const origenesPermitidos = process.env.CORS_ORIGENES_PERMITIDOS.split(";");


// BLOQUE CONFIGURACION
app.use(express.json())
app.use(cors({
    origen: origenesPermitidos
}))

clienteDB.connect((err) => {
    if (err) {
        console.log(`Error al conectar: $(err)`);
        return;
    }
    console.log("conectado");
    db = clienteDB.db("formacion");
    colecciones.personas = db.collection("personas");
    // colecciones.horas = db.collection("horas");

    // CRUD
    app.get('/empleados/', (request, response) => {
        colecciones.personas.find().toArray((err, items) => {
            if (err) {
                console.log(`Error al leer`)
            }
            response.send(items);
        })
    })

    app.get('/empleados/:id', (request, response) => {
        let id = request.params.id;
        //const empleado = res.send({ id: id, nombre: 'Pepe' })
        colecciones.personas.findOne({ _id: ObjectId(id) }, (err, item) => {
            response.send(item);
        })
    })

    app.post('/empleados/', (request, response) => {

        let body = request.body;
        colecciones.personas.insertOne(body)
            .then(insert => {
                return colecciones.personas.findOne({ _id: ObjectId(insert.insertedId) })
                //response.send(insert);
            })
            .then(item => {
                response.send(item);
            })
            .catch(err => {
                console.log(err);
                response.status(500).send(err);
            })

    })

    app.put('/empleados/:id', (request, response) => {
        let body = request.body;
        let id = request.params.id;
        colecciones.personas.findOneAndUpdate({ _id: ObjectId(id) }, { $set: body })
            .then(update => {
                return colecciones.personas.findOne({ _id: ObjectId(id) })
                //response.send(update);
            })
            .then(item => {
                response.send(item);
            })
            .catch(err => {
                console.log(err);
                response.status(500).send(err);
            })
    })

    app.delete('/empleados/:id', (request, response) => {
        let id = request.params.id;
        colecciones.personas.findOneAndDelete({ _id: ObjectId(id) })
            .then(deleteId => {
                //return colecciones.personas.findOne({ _id: ObjectId(id) })
                response.send(deleteId);
            })
            //.then(item => {
            //    response.send(item);
            //})
            .catch(err => {
                console.log(err);
                response.status(500).send(err);
            })
    })

})




// LANZAR APLICACION
app.listen(port, () => console.log(`Aplicación escuchando en el puerto ${port}`))


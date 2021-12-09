
// BLOQUE IMPORTACIONES
const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const EmpleadosService = require("./servicios/EmpleadosService")
const HorasService = require("./servicios/HorasService")
const PlantasService = require("./servicios/PlantasService")
const PgService = require("./servicios/PgService")
const MssqlUsuariosService = require("./servicios/MssqlService")
const rutasEmpleados = require("./controladores/empleados")
const rutasHoras = require("./controladores/horas")
const rutasPlantas = require("./controladores/plantas")
const rutasUsuariosPG = require("./controladores/usuariosPG")
const rutasUsuariosMSSQL = require("./controladores/usuariosMSSQL")
const { Client } = require("pg")
const mssql = require("mssql")


// BLOQUE VARIABLES
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000
//const db = require('./connections/mongodb')
const clienteDB = new MongoClient("mongodb://localhost:27017/formacion")
let db = null;
const origenesPermitidos = process.env.CORS_ORIGENES_PERMITIDOS.split(";");
const clientPG = new Client();
const configMssql = {
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DATABASE,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD
}
if (process.env.NODE_ENV != "production") {
    configMssql.trustServerCertificate = true;
}

// BLOQUE CONFIGURACION
app.use(express.json())
app.use(cors({
    origen: origenesPermitidos
}))

app.use((request, response, next) => {
    // console.log(request);
    setTimeout(() => {
        request.params.user = { "nombre": "nombre" };
        console.log("LDAP Confirma datos")
        next();
    }, 2000)
})

mssql.connect(configMssql).then(pool => {
    console.log("Conectado a MS SQL")
    app.set("MssqlDB", new MssqlUsuariosService(pool));
});

clientPG.connect().then(() => {
    console.log("Conectado a Postgres")
    app.set("PgDB", new PgService(clientPG));
});

clienteDB.connect((err) => {
    if (err) {
        console.log(`Error al conectar: ${err}`);
        return;
    }
    console.log("Conectado a mongo");

    db = clienteDB.db("formacion");
    app.set("empleadosDB", new EmpleadosService(db));
    app.set("horasDB", new HorasService(db));
    app.set("plantasDB", new PlantasService(db));
})

app.use("/empleados/", rutasEmpleados);
app.use("/horas/", rutasHoras);
app.use("/plantas/", rutasPlantas);
app.use("/usuariosPG/", rutasUsuariosPG);
app.use("/usuariosMSSQL/", rutasUsuariosMSSQL);

app.get('/', (request, response) => {
    const app = request.app;
    const empleadosService = app.get(servicio);
    empleadosService.lista()
        .then(res => {
            response.send(res);
        })
        .catch(err => {
            console.log(err);
        })
})



app.put('/clientes/:id', (request, response) => {
    const id = request.params.id,
        body = request.body;

    // Funcionalidad del controlador
    // ...
})



// LANZAR APLICACION
app.listen(port, () => console.log(`Aplicación escuchando en el puerto ${port}`))


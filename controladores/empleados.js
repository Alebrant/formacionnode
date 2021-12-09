const express = require("express");
const router = express.Router();

router.get('/', (request, response) => {
    const app = request.app;
    const empleadosService = app.get("empleadosDB");
    empleadosService.lista()
        .then(res => {
            response.send(res);
        })
        .catch(err => {
            console.log(err);
        })
})
router.get('/:id', (request, response) => {
    let id = request.params.id;
    const app = request.app;
    const empleadosService = app.get("empleadosDB");
    empleadosService.detalle(id)
        .then(item => {
            response.send(item);
        })
})
router.post('/', (request, response) => {
    let body = request.body;
    const app = request.app;
    const empleadosService = app.get("empleadosDB");
    empleadosService.crear(body)
        .then(item => {
            response.send(item);
        })
        .catch(err => {
            console.log(err);
            response.status(500).send(err);
        })
})
router.put('/:id', (request, response) => {
    let body = request.body;
    let id = request.params.id;
    const app = request.app;
    const empleadosService = app.get("empleadosDB");
    empleadosService.guardar(id, body)
        .then(item => {
            response.send(item);
        })
        .catch(err => {
            console.log(err);
            response.status(500).send(err);
        })
})

router.delete('/:id', (request, response) => {
    let id = request.params.id;
    const app = request.app;
    const empleadosService = app.get("empleadosDB");
    empleadosService.borrar(id)
        .then(deleteId => {
            response.send(deleteId);
        })
        .catch(err => {
            console.log(err);
            response.status(500).send(err);
        })
})

module.exports = router;
const { ObjectId } = require("mongodb");

class PlantasService {
    constructor(db) {
        this.db = db;
        this.coleccion = db.collection("plantas");
    }

    lista() {
        return this.coleccion.find().toArray();
    }

    detalle(id) {
        return this.coleccion.findOne({ _id: ObjectId(id) });
    }

    crear(datos) {
        return this.coleccion.insertOne(datos)
            .then(insert => {
                return this.detalle(insert.insertedId)
            })
    }

    guardar(id, datos) {
        return this.coleccion.findOneAndUpdate({ _id: ObjectId(id) }, { $set: datos })
            .then(update => {
                return this.detalle(id);
            })
    }

    borrar(id) {
        return this.coleccion.findOneAndDelete({ _id: ObjectId(id) })
            .then(deletedData => {
                return deletedData.value;
            })
    }

}

module.exports = PlantasService;
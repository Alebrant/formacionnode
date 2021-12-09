const { ObjectId } = require("mongodb");

class HorasService {
    constructor(db) {
        this.db = db;
        this.coleccion = db.collection("horas");
    }

    lista() {
        return this.coleccion.find().toArray();
    }

    buscar(filtros) {
        let filtrosAUsar = {};
        if (filtros.usuario) {
            const regexUsuario = new RegExp(`.*${filtros.usuario}.*`, 'i');
            filtrosAUsar.usuario = regexUsuario;
        }
        if (filtros.horasMinimas) {
            if (!filtrosAUsar.cantidad) {
                filtrosAUsar.cantidad = {}
            }
            filtrosAUsar.cantidad.$gt = filtros.horasMinimas;
        }
        if (filtros.horasMaximas) {
            if (!filtrosAUsar.cantidad) {
                filtrosAUsar.cantidad = {}
            }
            filtrosAUsar.cantidad.$lte = filtros.horasMaximas;
        }
        return this.coleccion.find(filtrosAUsar).toArray();

    }
    buscarPorUsuario(usuario) {
        const regexUsuario = new RegExp(`.*${usuario}.*`),
            filtros = {
                usuario: regexUsuario
            }
        return this.coleccion.find(filtros).toArray();
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

module.exports = HorasService;
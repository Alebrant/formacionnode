const mssql = require("mssql")

class MssqlUsuariosService {
    constructor(client) {
        this.db = client;
    }

    lista() {
        return this.db.request().query("SELECT * FROM usuarios_2;").then(res => {
            return res.recordset;
        });
    }

    detalle(id) {
        return this.db.request()
            .input("id", mssql.Int, id)
            .query("SELECT * FROM usuarios_2 WHERE id = @id ;").then(res => {
                return res.recordset;
            })
            .then(res => {
                return res.length ? res[0] : {};
            });
    }
    crear(datos) {
        return this.db.request()
            .input('nombre', mssql.VarChar(100), datos.nombre)
            .input('email', mssql.VarChar(100), datos.email)
            .query("INSERT INTO usuarios_2 (nombre, email) VALUES (@nombre,@email); SELECT SCOPE_IDENTITY();")
            .then(res => { return res.recordset; })
            .then(arrayConId => { return arrayConId[0] })
            .then(objetoConId => { return objetoConId[""] })
            .then(id => { return this.detalle(id) });
    }

    guardar(id, datos) {
        return this.db.request()
            .input("id", mssql.Int, id)
            .input("nombre", mssql.VarChar(100), datos.nombre)
            .input("email", mssql.VarChar(100), datos.email)
            .query("UPDATE usuarios SET nombre = @nombre, email = @email WHERE id = @id")
            .then(() => {
                return this.detalle(id);
            })
    }

    borrar(id) {
        return this.db.request()
            .input("id", mssql.Int, id)
            .query("DELETE FROM usuarios WHERE id = @id")
            .then(() => {
                return { id: id }
            })
    }

}

module.exports = MssqlUsuariosService;
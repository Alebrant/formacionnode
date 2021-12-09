class PgUsuariosService {
    constructor(client) {
        this.db = client;
    }

    lista() {
        return this.db.query("SELECT * FROM usuarios;").then(res => {
            return res.rows;
        });
    }

    detalle(id) {
        return this.db.query("SELECT * FROM usuarios WHERE id = $1", [id])
            .then(res => {
                return res.rows;
            }).then(res => {
                if (res.length) {
                    return res[0];
                }
                return {};
            });
    }
    crear(datos) {
        return this.db.query("INSERT INTO usuarios (nombre, email) VALUES ($1,$2) RETURNING id", [datos.nombre, datos.email])
            .then(res => {
                return res.rows;
            }).then(res => {
                if (res.length) {
                    return res[0];
                }
                return {};
            }).then(res => {
                return res.id;
            }).then(id => {
                return this.detalle(id);
            });
    }

    guardar(id, datos) {
        return this.db.query("UPDATE usuarios SET nombre = $2, email = $3 WHERE id = $1", [id, datos.nombre, datos.email])
            .then(() => {
                return this.detalle(id);
            })
    }

    borrar(id) {
        return this.db.query("DELETE FROM usuarios WHERE id = $1", [id])
            .then(() => {
                return { id: id }
            })
    }

    buscar(filtros) {
        let sql = "SELECT * FROM usuarios",
            valores = [];
        if (filtros.nombre) {
            sql = sql + " WHERE nombre LIKE '%' || $1 || '%'"
            valores.push(filtros.nombre)
        }

        return this.db.query(sql, valores).then(res => {
            return res.rows;
        });
    }

    updateMasivo(filtro, update) {
        let updatesRealizados = [];
        return this.db.query("BEGIN;").then(() => {
            this.buscar(filtro).then(datosACambiar => {
                datosACambiar.forEach(datoACambiar => {
                    datoACambiar.nombre = update.nombre;
                    this.guardar(datoACambiar.id, datoACambiar).then(() => {
                        updatesRealizados.push(datoACambiar);
                    })
                })
            })
            return this.db.query("COMMIT;")
        }).then(() => {
            return updatesRealizados;
        })
    }

}

module.exports = PgUsuariosService;
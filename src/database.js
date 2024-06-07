const mysql = require("promise-mysql")

let databaseConnection = undefined

/*Creating a connection to the database*/
mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
})
.then(_databaseConnection => {
    databaseConnection = _databaseConnection
})
.catch(err => {
    console.error("La connexion a la base de donnée a échouée", err)
    throw err
})

module.exports.getDatabaseConnection = function() {
    return databaseConnection
}
//Importation du module express
const express = require('express')
//Initialisation d'une première instance, express sera utilisé sous l'appellation app
const app = express()

//Importation des variables d'environnement 
require('dotenv').config()

//Importation du module 'promise-mysql' pour l'interaction avec la bdd
const mysql = require("promise-mysql")
//Importeation du module 'cors'
const cors = require('cors')

//Activation du module 
app.use(cors())

//Importation du module 'express-fileupload'
const fileUpload = require("express-fileupload")

//Ajout du middleware 'express-fileupload' à l'appli Express, création du répertoire parent s'il n'existe pas
app.use(fileUpload({
    createParentPath: true
}))

//Importaton du middleware 'express.urlencoded' pour gérer les données envoyées par les formulaires HTML 
app.use(express.urlencoded({extended: false}))
//Importation du middleware 'express.json' pour gérer les données envoyées dans le corps des requêtes HTTP au format JSON
app.use(express.json())
//Importation du middleware 'express.static' pour rendre accessibles les fichiers static dans le répertoire 'public'depuis le navigateur
app.use(express.static(__dirname+'/public'))

const host = process.env.HOST 
const database = process.env.DATABASE 
const user = process.env.USER 
const password = process.env.PASSWORD 

// Importation des routes 
//const professionnalRoutes = require('./routes/ProfessionnalRoutes')
//const openingHoursRoutes = require('./routes/OpeningHoursRoutes')

mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password
}).then((db)=>{
    console.log("Connexion Ok")
    setInterval(async ()=>{
        let res = await db.query ('SELECT 1')
    }, 1000)

    app.get('/', async (req, res, next)=>{
        res.json({status: 200, msg: "Connexion root OK"})
    })

    //Appel des routes 
    //professionnalRoutes(app, db)
    //openingHoursRoutes(app, db)
})
.catch(err => console.log('Echec connexion', err))

const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log(`Ecoute sur le port ${PORT}`)
})
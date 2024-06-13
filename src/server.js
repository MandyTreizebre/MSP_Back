// Importation du module express
const express = require('express')

// Création d'une application express
const app = express()

// Importation de body-parser pour analyser les corps de requêtes HTTP
const bodyParser = require('body-parser')

// Importation de cookie-parser pour analyser les cookies dans les requêtes
const cookieParser = require('cookie-parser')

// Utilisation du middleware cookie-parser avec l'application express
app.use(cookieParser())

// Chargement des variables d'environnement depuis un fichier .env
require('dotenv').config()

// Importation du module promise-mysql pour interagir avec la base de données
const mysql = require("promise-mysql")

// Importation du module cors pour permettre les requêtes cross-origin
const cors = require('cors')

// Activation du middleware cors avec des configurations spécifiques
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173', 
    allowedHeaders: ['Authorization', 'Content-Type']
}))

// Utilisation de body-parser pour analyser les requêtes JSON
app.use(bodyParser.json())

// Utilisation de express.urlencoded pour analyser les données envoyées par des formulaires HTML
app.use(express.urlencoded({extended: true}))

// Utilisation de express.json pour analyser les données JSON envoyées dans le corps des requêtes HTTP
app.use(express.json())

// Utilisation de express.static pour rendre les fichiers statiques dans le répertoire 'public' accessibles depuis le navigateur
app.use(express.static(__dirname+'/../public'))

// Définition des paramètres de connexion à la base de données à partir des variables d'environnement
const host = process.env.HOST 
const database = process.env.DATABASE 
const user = process.env.USER 
const password = process.env.PASSWORD 

/* Importation des routes */
const professionalsRoutes = require('./routes/ProfessionalsRoutes')
const openingHoursRoutes = require('./routes/OpeningHoursRoutes')
const externalProfessionalsRoutes = require ('./routes/ExternalProfessionalsRoutes')
const newsRoutes = require ('./routes/NewsRoutes')
const adminsRoutes = require('./routes/AdminsRoutes')
const infosRoutes = require('./routes/HealthInformationsRoutes')
const authRoutes = require('./routes/AuthRoutes')

// GOOGLE RECAPTCHA


// Création d'une connexion à la base de données
mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password
}).then((db)=>{
    console.log("Connexion Ok")
    // Configuration d'un intervalle pour maintenir la connexion active
    setInterval(async ()=>{
        let res = await db.query ('SELECT 1')
    }, 1000)

    // Définition d'une route racine pour vérifier la connectivité de base
    app.get('/', async (req, res, next)=>{
        res.json({status: 200, msg: "Connexion root OK"})
    })

    // Appel des fonctions de route et passage de l'application et de la connexion à la base de données comme arguments
    professionalsRoutes(app, db)
    openingHoursRoutes(app, db)
    externalProfessionalsRoutes(app, db)
    newsRoutes(app, db)
    adminsRoutes(app, db)
    infosRoutes(app, db)
    authRoutes(app, db)
})
.catch(err => console.log('Echec connexion', err))

// Définition du port à partir des variables d'environnement
const PORT = process.env.PORT

// Démarrage du serveur et écoute sur le port défini
app.listen(PORT, () =>{
    console.log(`Ecoute sur le port ${PORT}`)
})


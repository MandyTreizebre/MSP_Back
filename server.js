/*Importing the express module*/
const express = require('express')
/*Initializing a new instance of express, which will be referred to as app*/
const app = express()

/*Importing the cookie-parser middleware*/
const cookieParser = require('cookie-parser')
/*Using cookie-parser middleware with the app*/
app.use(cookieParser())

/*Importing environment variables */
require('dotenv').config()

/*Importing the 'promise-mysql' module for interaction with the database*/
const mysql = require("promise-mysql")
/*Importing the 'cors' module*/
const cors = require('cors')

/*Enabling the cors middleware with specific configurations*/
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173', 
    allowedHeaders: ['Authorization', 'Content-Type']
}))

/*Importing the 'express-fileupload' module*/
const fileUpload = require("express-fileupload")

/*Adding the 'express-fileupload' middleware to the Express app, creating parent directory if it doesn't exist*/
app.use(fileUpload({
    createParentPath: true
}))

/*Importing the 'express.urlencoded' middleware to handle data sent by HTML forms*/
app.use(express.urlencoded({extended: false}))
/*Importing the 'express.json' middleware to handle JSON data sent in the HTTP request body*/
app.use(express.json())
/*Importing the 'express.static' middleware to make static files in the 'public' directory accessible from the browser*/
app.use(express.static(__dirname+'/public'))

/*Defining database connection parameters from environment variables*/
const host = process.env.HOST 
const database = process.env.DATABASE 
const user = process.env.USER 
const password = process.env.PASSWORD 

/*Importing routes*/
const professionalRoutes = require('./routes/ProfessionalRoutes')
const openingHoursRoutes = require('./routes/OpeningHoursRoutes')
const externalProfessionalsRoutes = require ('./routes/ExternalProfessionalsRoutes')
const newsRoutes = require ('./routes/NewsRoutes')
const adminRoutes = require('./routes/AdminRoutes')
const infosRoutes = require('./routes/HealthInformationsRoutes')
const authRoutes = require('./routes/authRoutes')

/*Creating a connection to the database*/
mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password
}).then((db)=>{
    console.log("Connexion Ok")
    /*Setting an interval to keep the connection alive*/
    setInterval(async ()=>{
        let res = await db.query ('SELECT 1')
    }, 1000)

    /*Defining a root route for basic connectivity check*/
    app.get('/', async (req, res, next)=>{
        res.json({status: 200, msg: "Connexion root OK"})
    })

    /*Calling the route functions and passing the app and database connection as arguments*/
    professionalRoutes(app, db)
    openingHoursRoutes(app, db)
    externalProfessionalsRoutes(app, db)
    newsRoutes(app, db)
    adminRoutes(app, db)
    infosRoutes(app, db)
    authRoutes(app, db)
})
.catch(err => console.log('Echec connexion', err))

/*Defining the port from environment variables*/
const PORT = process.env.PORT

/*Starting the server and listening on the defined port*/
app.listen(PORT, () =>{
    console.log(`Ecoute sur le port ${PORT}`)
})
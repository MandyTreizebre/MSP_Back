const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const withAuth = require('../withAuth')
const validatePassword = require ('../validatePassword')

module.exports = (app, db)=>{
    /*Importing the AdminModel and initializing it with the database connection*/
    const adminModel = require('../models/AdminModel')(db)

    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/

    /*Route handler for saving an admin*/
    app.post('/api/save-admin', withAuth, validatePassword, async(req, res, next)=>{
      /*Validate email address with a regular expression*/
        if (!emailRegex.test(req.body.email)) {
            res.json({ status: 400, msg: 'Adresse email invalide' })
            return
        }
        /*Checking if the email already exists*/
        let adminChecked = await adminModel.getAdminByEmail(req.body.email)
        if(adminChecked.code){
            res.json({status: 500, msg:"Erreur", err: adminChecked})
        } else {
          /*If email exists, sending a 401 response*/
            if(adminChecked.length > 0){
                if(adminChecked[0].email === req.body.email){
                    res.json({status: 401, msg: "Email déjà utilisé."})
                }
            } else {
              /*If email doesn't exist, attempting to save the admin*/
                let admin = await adminModel.saveAdmin(req)
                if(admin.code){
                    res.json({status: 500, msg: "Problème lors de la création de l'administrateur", err: admin})
                } else {
                    res.json({status: 201, msg: "Administrateur créé"})
                }
            }
        }
    })

    /*Route handler for logging in*/
    app.post('/api/login', async (req, res, next) => {
        /*Validate email address with a regular expression*/
        if (!emailRegex.test(req.body.email)) {
            res.json({ status: 400, msg: 'Adresse email invalide' })
            return
        }
        if (req.body.email === "") {
          res.json({ status: 401, msg: "Entrez un email" })
        } else {
          /*Checking the email against the database*/
          let admin = await adminModel.getAdminByEmail(req.body.email)
          console.log("Admin ID:", admin[0].id)
          if (admin.code) {
            res.json({ status: 500, msg: "Erreur vérification email", err: admin })
          } else {
            /*If no admin found with the email, sending a 404 response*/
            if (admin.length === 0) {
              res.json({ status: 401, msg: "Pas d'utilisateur correspondant à ce mail." })
            } else {
              /*If admin found, comparing the password*/
              let same = await bcrypt.compare(req.body.password, admin[0].password)
              if (same) {
                /*If password matches, generating a token and sending it in the response*/
                const payload = { email: req.body.email, id: admin[0].id }
                const token = jwt.sign(payload, secret)
                res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'Strict', path: '/' })
                /*Updating the last connection time of the admin*/
                let connected = await adminModel.updateConnexion(admin[0].id)
                if (connected.code) {
                  res.json({ status: 500, err: connected })
                } else {
                  res.json({ status: 200, token: token, admin: admin[0] })
                }
              } else {
                res.json({ status: 403, msg: "Votre mot de passe est incorrect."})
              }
            }
          }
        }
    })

    app.get("/api/logout", (req, res) => {
      res.cookie("token", '', {maxAge: 0, httpOnly: true, path: '/' })
      res.json({status: 200, message: 'Logged Out'})
    } )
}
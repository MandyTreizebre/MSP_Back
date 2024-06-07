const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const withAuth = require('../middlewares/withAuth')
const validatePassword = require ('../middlewares/validatePassword')
const transporter = require("../config-nodemailer")
const crypto = require('crypto')

module.exports = (app, db)=>{
  const adminDAL = require('../DAL/AdminsDAL')(db)

  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const firstnameRegex = /^[A-Za-z\s]+$/

  // Route handler for saving an admin
  app.post('/api/register', withAuth, validatePassword, async(req, res, next) => {
      
    // checks if email is empty 
    if (req.body.email === "") {
      res.status(400).json({ msg: "Entrez un email" })
      return
    }

    // checks if the e-mail address matches the regex
    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({ msg: "Adresse email invalide" })
      return
    }

    // checks if firstname is empty 
    if (req.body.firstname === "") {
      res.status(400).json({ msg: "Entrez un prénom" })
      return
    }

    // checks if the e-mail address matches the regex
    if (!firstnameRegex.test(req.body.firstname)) {
      res.status(400).json({ msg: "Prénom invalide" })
      return
    }

    const admins = await adminDAL.getAdminByEmail(req.body.email)

    // checks for errors
    if (admins.code) {
      res.status(500).json({ msg: "Erreur interne du serveur" })
      return
    }

    // checks if an admin corresponds to an mail
    if (admins.length > 0) {
      if (admins[0].email === req.body.email) {
        res.status(400).json({ msg: "Email déjà utilisé." })
        return
      }
    }
  
    const admin = await adminDAL.saveAdmin(req)

    // checks for errors
    if (admin.code) {
      console.log(admin.code)
      res.status(500).json({ msg: "Problème lors de la création de l'administrateur" })
      return
    } 

    // register administrator
    res.status(201).json({ msg: "Administrateur créé" })
    return
  })
  
  // Route handler for logging in
  app.post('/api/login', async (req, res, next) => {

    // checks if email is empty
    if (req.body.email === "") {
      res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
      console.log( "Entrez un email" )
      return
    }

    // checks if the e-mail address matches the regex
    if (!emailRegex.test(req.body.email)) {
      console.log( "Adresse email invalide" )
      res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
      return
    }

    const admins = await adminDAL.getAdminByEmail(req.body.email)

    // checks for errors
    if (admins.code) {
      console.log( "Erreur interne du serveur", admins.code )
      res.status(500).json({ msg: "Erreur interne du serveur" })
      return
    }
                                                                                                      
    // checks if an admin corresponds to an mail
    if (admins.length === 0) {
      console.log( "Pas d'utilisateur correspondant à ce mail." )
      res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
      return
    }

    const admin = admins[0]
        
    //If admin found, comparing the password
    const isPasswordsEquals = await bcrypt.compare(req.body.password, admin.password)

    // throw error if passwords not matching
    if (!isPasswordsEquals) {
      res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
      console.error( "Mot de passe incorrect" )
      return
    }

    // If password matches, generating a token and sending it in the response 
    const payload = { email: req.body.email, id: admin.id }
    const token = jwt.sign(payload, secret)

    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'Strict', path: '/' })

    // Updating the last connection time of the admin 
    const connected = await adminDAL.updateConnexion(admin.id)

    if (connected.code) {
      res.status(500).json({ msg:"Erreur interne" })
      return
    } 

    res.status(200).json({ token: token, admin: admin })
    return
  })

  // Route handler for logout
  app.get("/api/logout", withAuth, (req, res) => {
    res.cookie("token", '', {maxAge: 0, httpOnly: true, path: '/' })

    res.status(200).json({ msg: 'Déconnecté' })
    return
  })

  // Route for reset password 
  app.post('/api/forgot-password', async (req, res) => {
    const email = req.body.email

    // checks if the e-mail address matches the regex
    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({ msg: "Adresse email invalide" })
      return
    }

    const admins = await adminDAL.getAdminByEmail(req.body.email)

    // checks if an admin corresponds to an mail
    if (admins.length === 0) {
      res.status(400).json({ msg: "Vérifiez votre adresse mail" })
      console.error( "Pas d'utilisateur correspondant à ce mail." )
      return
    }

    // checks if an admin corresponds to an mail
    if (admins.length > 0) {
      // generates a reset token
      const resetToken = crypto.randomBytes(20).toString('hex')

      // Set an expiry date for the token
      const resetTokenExpires = new Date(Date.now() + 2 * 60 * 1000)
      
      await adminDAL.updateAdmin(email, resetToken, resetTokenExpires)

      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`
      
      //Configure Mail options nodemailer
      let mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Réinitialisation du mot de passe',
          html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : <a href="${resetLink}">Réinitialiser mon mot de passe</a></p>`
      }

      if (admins.code) {
        res.status(500).json({ msg:"Erreur interne" })
        return
      } 

      transporter.sendMail(mailOptions, function(error, info){
        res.status(200).send({ msg: 'Un email de réinitialisation a été envoyé' })
        return
      })
    }
  })

  app.post('/api/reset-password', validatePassword, async (req, res) => {
    const { token, newPassword, email } = req.body

    // checks if the e-mail address matches the regex
    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({ msg: "Adresse email invalide" })
      return
    }

    const admin = await adminDAL.getAdminByEmail(email)

    // checks if an admin corresponds to an mail
    if (admin.length === 0) {
      res.status(400).json({ msg: "Erreur dans l'adresse mail" })
      return
    }

    const adminData = admin[0]

    // checks if token has expired
    if (new Date(adminData.resetTokenExpires) < new Date()) {
      res.status(400).send({ msg: 'Token invalide ou expiré' })
      return
    }

    // checks if tokens are identics  
    if (adminData.resetToken !== token) {
      res.status(400).send({ msg: 'Token invalide'})
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    await adminDAL.updateAdmin(email, hashedPassword)

    res.status(200).send({ msg: 'Mot de passe réinitialisé avec succès' })
    return
  })
}
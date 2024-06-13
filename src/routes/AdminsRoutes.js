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

    // Enregistrer un nouvel admin
    app.post('/api/register', withAuth, validatePassword, async(req, res, next) => {
      
        // Vérifie si le champ d'email est vide
        if (req.body.email === "") {
            res.status(400).json({ msg: "Entrez un email" })
            return
        }

        // Vérifie si l'email est conforme au regex
        if (!emailRegex.test(req.body.email)) {
            res.status(400).json({ msg: "Adresse email invalide" })
            return
        }

        // Vérifie si le champ du prénom est vide
        if (req.body.firstname === "") {
            res.status(400).json({ msg: "Entrez un prénom" })
            return
        }

        // Vérifie si le prénom est conforme au regex
        if (!firstnameRegex.test(req.body.firstname)) {
            res.status(400).json({ msg: "Prénom invalide" })
            return
        }

        const admins = await adminDAL.getAdminByEmail(req.body.email)

        // Vérif des erreurs
        if (admins.code) {
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return
        }

        // Vérifie si un admin correspond à l'email
        if (admins.length > 0) {
            if (admins[0].email === req.body.email) {
                res.status(400).json({ msg: "Email déjà utilisé." })
                return
            }
        }
  
        const admin = await adminDAL.saveAdmin(req)

        // Vérif des erreurs
        if (admin.code) {
            res.status(500).json({ msg: "Problème lors de la création de l'administrateur" })
            return
        } 

        // Enregistrement de l'admin
        res.status(201).json({ msg: "Administrateur créé" })
        return
    })
  
    // Connexion
    app.post('/api/login', async (req, res, next) => {

        // Vérifie si le champ de l'email est vide
        if (req.body.email === "") {
            res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
            return
        }

        // Vérifie si l'email est conforme au regex
        if (!emailRegex.test(req.body.email)) {
            res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
            return
        }

        const admins = await adminDAL.getAdminByEmail(req.body.email)

        // Vérif des erreurs
        if (admins.code) {
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return
        }
                                                                                                      
        // Vérifie si un admin correspond à un email 
        if (admins.length === 0) {
            res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
            return
        }

        const admin = admins[0]
        
        // Si un admin est trouvé, comparaison du mot de passe
        const isPasswordsEquals = await bcrypt.compare(req.body.password, admin.password)

        // Si les mots de passes ne correspondent pas 
        if (!isPasswordsEquals) {
            res.status(400).json({ msg: "Erreur d'authentification, adresse mail ou mot de passe invalide" })
            return
        }

        // Si les mots de passes correspondent, génération d'un token 
        const payload = { email: req.body.email, id: admin.id }
        const token = jwt.sign(payload, secret)

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'Strict', path: '/' })

        // Mise à jour de la connexion admin
        const connected = await adminDAL.updateConnexion(admin.id)

        if (connected.code) {
            res.status(500).json({ msg:"Erreur interne" })
            return
        } 

        // Si tout est ok, envoie du token et des infos de l'admin
        res.status(200).json({ token: token, admin: admin })
        return
    })

    // Déconnexion
    app.get("/api/logout", withAuth, (req, res) => {

        res.cookie("token", '', {maxAge: 0, httpOnly: true, path: '/' })

        res.status(200).json({ msg: 'Déconnecté' })
        return
    })

    // Mot de passe oublié 
    app.post('/api/forgot-password', async (req, res) => {
        const email = req.body.email 
    
        //Vérifie si l'email est conforme au regex
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Adresse email invalide" }) 
        }
    
        try {
            //Récupère les informations de l'administrateur à partir de la db
            const admins = await adminDAL.getAdminByEmail(email) 
            
            //Si pas d'admin trouvé 
            if (admins.length === 0) {
                return res.status(400).json({ msg: "Vérifiez votre adresse mail" }) 
            }
    
            //Génère un token de réinitialisation et définit la date d'expiration (2min) 
            const resetToken = crypto.randomBytes(20).toString('hex') 
            const resetTokenExpires = new Date(Date.now() + 2 * 60 * 1000) 
    
            //Mise à jour de l'admin dans la db avec le token et la date d'expiration 
            await adminDAL.updateAdmin(email, { reset_token: resetToken, reset_token_expiration: resetTokenExpires }) 
    
            //Création d'un lien de réinitialisation incluant le token généré
            const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`
            //Configuration du mail
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Réinitialisation du mot de passe',
                html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : <a href="${resetLink}">Réinitialiser mon mot de passe</a></p>`
            } 
    
            //Envoi de l'email avec nodemailer
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ msg: "Erreur lors de l'envoi de l'email" }) 
                }
                res.status(200).send({ msg: 'Un email de réinitialisation a été envoyé' }) 
            }) 
        } catch (error) {
            res.status(500).json({ msg: "Erreur interne" }) 
        }
    }) 
    
    // Réinitialisation du mot de passe 
    app.post('/api/reset-password', async (req, res) => {
        //Récupération du token, du nouveau mdp et de l'email
        const { token, newPassword, email } = req.body 
    
        //Vérifie si l'email est conforme au regex
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Adresse email invalide" }) 
        }
    
        try {
            //Recherche de l'admin dans la db avec l'email
            const admins = await adminDAL.getAdminByEmail(email) 
            const admin = admins[0] 
    
            //Aucun admin trouvé
            if (!admin) {
                return res.status(400).json({ msg: "Erreur dans l'adresse mail" }) 
            }
    
            //Si le token a expiré 
            if (new Date(admin.reset_token_expiration) < Date.now()) {
                return res.status(400).send({ msg: 'Token invalide ou expiré' }) 
            }
    
            //Si le token reçu correspond au token stocké
            if (admin.reset_token !== token) {
                return res.status(400).send({ msg: 'Token invalide' }) 
            }
    
            //Mise à jour du mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10) 
            await adminDAL.updateAdmin(email, {
                password: hashedPassword,
                reset_token: null,
                reset_token_expiration: null
            }) 
    
            res.status(200).send({ msg: 'Mot de passe réinitialisé avec succès' }) 
        } catch (error) {
            res.status(500).json({ msg: "Erreur interne" }) 
        }
    }) 
}
const withAuth = require('../middlewares/withAuth')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

module.exports = (app, db)=>{
    const adminDAL = require('../DAL/AdminsDAL')(db)

    // Vérification du token
    app.get('/api/admin/checkToken', withAuth, async (req, res, next)=>{
    
        let admin = await adminDAL.getAdminById(req.id)

        // Vérification des erreurs 
        if (admin.code) {
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return 
        } 

        // Ajoute le token à l'objet admin retourné
        admin[0].token = req.token
        
        // Envoi du statut 200 et des informations de l'admin 
        res.status(200).json({ admin: admin[0] })
        return
    })
}
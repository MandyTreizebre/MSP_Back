const withAuth = require('../middlewares/withAuth')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

module.exports = (app, db)=>{
    const adminDAL = require('../DAL/AdminsDAL')(db)

    app.get('/api/admin/checkToken', withAuth, async (req, res, next)=>{
    
        let admin = await adminDAL.getAdminById(req.id)

        // Check for errors
        if (admin.code) {
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return 
        } 

        admin[0].token = req.token
        
        res.status(200).json({ admin: admin[0] })
        return
    })
}
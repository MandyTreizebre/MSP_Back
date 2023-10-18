const withAuth = require('../withAuth')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


module.exports = (app, db)=>{
    const adminModel = require('../models/AdminModel')(db)

    app.get('/admin/checkToken', withAuth, async (req, res, next)=>{
        console.log("Requête reçue pour checkToken avec headers:", req.headers);
        let admin = await adminModel.getAdminById(req.id)
        if(admin.code){
            console.log(admin.code)
            res.json({status: 500, err: admin})
        } else {
            res.json({status: 200, admin: admin[0]})
        }
    })
}
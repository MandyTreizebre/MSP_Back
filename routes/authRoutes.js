const withAuth = require('../withAuth')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


module.exports = (app, db)=>{
    /*Importing the Admin model initialized with the database connection*/
    const adminModel = require('../models/AdminModel')(db)

    /*Definition of a GET route to verify the token. This route uses the withAuth middleware for authentication*/
    app.get('/api/admin/checkToken', withAuth, async (req, res, next)=>{
        /*Attempt to retrieve admin information using ID extracted from token by withAuth middleware*/
        let admin = await adminModel.getAdminById(req.id)
        /*Check whether an error has occurred during the database query*/
        if(admin.code){
            /*send a response with status 500 in the event of an error*/
            res.json({status: 500})
        } else {
            /*Send response with 200 status and admin information in case of success*/
            admin[0].token = req.token
            res.json({status: 200, admin: admin[0]})
        }
    })
}
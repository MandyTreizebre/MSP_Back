const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const withAuth = require('../withAuth')

module.exports = (app, db)=>{
    const adminModel = require('../models/AdminModel')(db)

    app.post('/admin/save', withAuth, async(req, res, next)=>{
        let userChecked = await adminModel.getAdminByEmail(req.body.email)
        if(userChecked.code){
            res.json({status: 500, msg:"Erreur", err: userChecked})
        } else {
            if(userChecked.length > 0){
                if(userChecked[0].email === req.body.email){
                    res.json({status: 401, msg: "Email déjà utilisé."})
                }
            } else {
                let user = await adminModel.saveAdmin(req)
                if(user.code){
                    res.json({status: 500, msg: "Problème", err: user})
                } else {
                    res.json({status: 200, msg: "Utilisateur enregistré"})
                }
            }
        }
    })

    app.post('/login', async (req, res, next) => {
        if (req.body.email === "") {
          res.json({ status: 401, msg: "Entrez un email" })
        } else {
          let user = await adminModel.getAdminByEmail(req.body.email)
          if (user.code) {
            console.log(user.code)
            res.json({ status: 500, msg: "Erreur vérification email", err: user })
          } else {
            if (user.length === 0) {
              res.json({ status: 404, msg: "Pas d'utilisateur correspondant à ce mail." })
            } else {
              let same = await bcrypt.compare(req.body.password, user[0].password)
              if (same) {
                const payload = { email: req.body.email, id: user[0].id, role: user[0].role }
                const token = jwt.sign(payload, secret, {expiresIn: '1h'})
                let connect = await adminModel.updateConnexion(user[0].id)
                if (connect.code) {
                  console.log("CONSOLE DE CONNECT.CODE:", connect.code)
                  res.json({ status: 500, err: connect })
                } else {
                  res.json({ status: 200, token: token, user: user[0] })
                  console.log("CONSOLE DE STATUS 200 USER ET TOKEN", token, user[0])
                }
              } else {
                res.json({ status: 401, msg: "Votre mot de passe est incorrect." })
              }
            }
          }
        }
    })
}
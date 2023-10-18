const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = (_db)=>{
    db=_db
    return AdminModel
}

class AdminModel {
    static saveAdmin(req){
       return bcrypt.hash(req.body.password, saltRounds) 
       .then((hash)=>{
        return db.query('INSERT INTO admin (email, password, firstname, connexionTime) VALUES (?, ?, ?, NOW())', [req.body.email, hash, req.body.firstname])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
       })
       .catch((err)=>console.log(err))
    }

    static getAdminByEmail(email){
        return db.query('SELECT * FROM admin WHERE email = ?', [email])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
            
        })
    }

    static getAdminById(id){
        return db.query('SELECT * FROM admin WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    static updateConnexion(id){
        return db.query('UPDATE admin SET connexionTime = NOW() WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


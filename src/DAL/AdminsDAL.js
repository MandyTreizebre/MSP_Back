const bcrypt = require('bcrypt') 
const saltRounds = 10 

//Export function to initialize DAL with database connection
module.exports = (_db)=>{
    db=_db 
    return AdminsDAL
}

class AdminsDAL {
    // Register a new administrator in the database 
    static saveAdmin(req){
        // Hash administrator password
       return bcrypt.hash(req.body.password, saltRounds) 
       .then((hash)=>{
        // Insert administrator into database with hashed password
        return db.query('INSERT INTO admin (email, password, firstname, connexionTime) VALUES (?, ?, ?, NOW())', [req.body.email, hash, req.body.firstname])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
       })
       .catch((err)=> {
        return err
       })
    }

    // Get an administrator from the database by email 
    static getAdminByEmail(email){
        return db.query('SELECT id, email, password, firstname FROM admin WHERE email = ?', [email])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            console.log("err")
            return err
        })
    }

    // Get an administrator from the database by id
    static getAdminById(id){
        return db.query('SELECT id,email, password, firstname FROM admin WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Update an admin login date and time
    static updateConnexion(id){
        return db.query('UPDATE admin SET connexionTime = NOW() WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Update admin 
    static updateAdmin(email, resetToken, resetTokenExpires){
        return db.query('UPDATE admin SET reset_token= ?, reset_token_expiration= ? WHERE email= ?',[resetToken, resetTokenExpires, email])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


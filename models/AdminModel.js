const bcrypt = require('bcrypt') /*Importing the bcrypt library for password hashing*/
const saltRounds = 10 /*Set number of salt turns for bcrypt hash*/

/*Export function to initialize model with database connection*/
module.exports = (_db)=>{
    db=_db /*Assign database connection to a global variable db*/
    return AdminModel
}

class AdminModel {
    /* Register a new administrator in the database */
    static saveAdmin(req){
        /*Hash administrator password*/
       return bcrypt.hash(req.body.password, saltRounds) 
       .then((hash)=>{
        /*Insert administrator into database with hashed password*/
        return db.query('INSERT INTO admin (email, password, firstname, connexionTime) VALUES (?, ?, ?, NOW())', [req.body.email, hash, req.body.firstname])
            .then((res)=>{
                /*Return query result in case of success*/
                return res
            })
            .catch((err)=>{
                /*Return query result in case of error*/
                return err
            })
       })
       .catch((err)=> {
        /*Return error on password hash failure*/
        return err
       })
    }

    /*Get an administrator from the database by email */
    static getAdminByEmail(email){
        /*Request for administrator with specified email address*/
        return db.query('SELECT id, email, password, firstname FROM admin WHERE email = ?', [email])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Get an administrator from the database by id*/
    static getAdminById(id){
        /*Request for administrator with specified id*/
        return db.query('SELECT id,email, password, firstname FROM admin WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Update an administrator's login date and time*/
    static updateConnexion(id){
        /*Request to update the administrator's login date and time with the specified ID*/
        return db.query('UPDATE admin SET connexionTime = NOW() WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


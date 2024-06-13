const bcrypt = require('bcrypt') 
const saltRounds = 10 

module.exports = (_db)=>{
    db=_db 
    return AdminsDAL
}

class AdminsDAL {
    
    // Enregistrer un nouvel admin
    static saveAdmin(req){
        // Hash du mot de passe
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
       //Envoi une erreur si le hash du mdp se passe mal 
       .catch((err)=> {
            return err
       })
    }

    // Obtenir un admin par son mail
    static getAdminByEmail(email){
        return db.query('SELECT id, email, password, firstname, reset_token, reset_token_expiration FROM admin WHERE email = ?', [email])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir un admin par son ID
    static getAdminById(id){
        return db.query('SELECT id,email, password, firstname FROM admin WHERE id = ?', [id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Mise à jour de la connexion admin
    static updateConnexion(id){
        return db.query('UPDATE admin SET connexionTime = NOW() WHERE id = ?', [id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Mettre à jour un admin
    static updateAdmin(email, updateFields){
        const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ')
        const values = [...Object.values(updateFields), email]

        return db.query(`UPDATE admin SET ${setClause} WHERE email = ?`, values)
            .then(res => res)
            .catch(err => err)
    }
}


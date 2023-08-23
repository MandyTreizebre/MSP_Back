module.exports = (_db) => {
    db = _db
    return ExternalProfessionals
}

class ExternalProfessionals {
    //Récupération de tous les autres professionnels
    static getExternalPros(){
        return db.query('SELECT * from external_professionals')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    } 

    //Ajout d'autres professionnels
    static addExternalPro(req){
        return db.query('INSERT INTO external_professionals(name, picture, link) VALUES(?, ?, ?)',
        [req.body.name, req.body.picture, req.body.link])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Modification d'un autre pros 
    static updateExternalPro(req, id){
        return db.query('UPDATE external_professionals SET name= ?, picture= ?, link= ? WHERE id= ?', 
        [req.body.name, req.body.picture, req.body.link, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Supprfession d'un autre pros 
    static deleteExternalPro(id){
        return db.query('DELETE FROM external_professionals WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
}
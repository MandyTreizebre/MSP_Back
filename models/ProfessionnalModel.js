module.exports = (_db) => {
    db = _db
    return ProfessionalModel
}

class ProfessionalModel {

    //Récupération de tous les professionnels (Page Admin)
    static getAllProfessionals(){
        return db.query('SELECT * FROM professionnels ')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des professionnels par ID (Page Admin)
    static GetProfessionalById(id){
        return db.query('SELECT * FROM professionnels  WHERE id = ?',[id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Ajout d'un professionnel (Page Admin)
    static addProfessional(req){
        return db.query('INSERT INTO professionnels (nom, prenom, addresse, code_postal, ville, telephone, details, specialitee_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.nom, req.body.prenom, req.body.addresse, req.body.code_postal, req.body.ville, req.body.telephone, req.body.details, req.body.specialitee_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Modification d'un professionnel (Page Admin)
    static updateProfessional(req, id){
        return db.query('UPDATE professionnels SET nom= ?, prenom= ?, addresse=?, code_postal= ?, ville= ?, telephone= ?, details= ?',
        [req.body.nom, req.body.prenom, req.body.addresse, req.body.code_postal, req.body.ville, req.body.telephone, req.body.details, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Suppression d'un professionnel (Page Admin)
    static deleteProfessional(id){
        return db.query('DELETE FROM professionnels WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des professionnels par spécialisation (Page des pros x9)
    static getProfessionnalBySpecialiteeId(specialitee_id){
        return db.query('SELECT * FROM professionnels WHERE specialitee_id = ?', [specialitee_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }


    //Récupération des spécialisations (page d'accueil pour les "cards")
    static getAllSpecialisation(){
        return db.query('SELECT * FROM specialisations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


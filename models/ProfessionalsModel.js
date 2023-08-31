module.exports = (_db) => {
    db = _db
    return ProfessionalsModel
}

class ProfessionalsModel {

    //Récupération de tous les professionnels (Page Admin)
    static getAllProfessionals(){
        return db.query('SELECT * FROM professionals ')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des professionnels par ID (Page Admin)
    static GetProfessionalById(id){
        return db.query('SELECT * FROM professionals  WHERE id = ?',[id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Ajout d'un professionnel (Page Admin)
    static addProfessional(req){
        return db.query('INSERT INTO professionals (lastname, firstname, address, zip, city, phone, details, speciality_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, req.body.speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Modification d'un professionnel (Page Admin)
    static updateProfessional(req, id){
        return db.query('UPDATE professionals SET lastname= ?, firstname= ?, address=?, zip= ?, city= ?, phone= ?, details= ? WHERE id= ?',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Suppression d'un professionnel (Page Admin)
    static deleteProfessional(id){
        return db.query('DELETE FROM professionals WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des professionnels par spécialisation (Page des pros x9)
    static getProfessionnalBySpecialityId(speciality_id){
        return db.query('SELECT * FROM professionals INNER JOIN specializations ON professionals.speciality_id = specializations.id WHERE speciality_id = 1', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }


    //Récupération des spécialisations (page d'accueil pour les "cards")
    static getAllSpecializations(){
        return db.query('SELECT * FROM specializations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


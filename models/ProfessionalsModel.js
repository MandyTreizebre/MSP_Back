module.exports = (_db) => {
    db = _db
    return ProfessionalsModel
}

class ProfessionalsModel {

    //Récupération de tous les professionnels (Page Admin)
    static getAllProfessionals(){
        return db.query('SELECT DISTINCT professionals.id, professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details, professionals.speciality_id, professionals.isActive, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    static getOnlyProfessionals(){
        return db.query('SELECT * FROM professionals')
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

    //Ajout d'un professionnel (Page Admin) OK VERIF
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

    //Modification d'un professionnel (Page Admin) OK VERIF
    static updateProfessional(req, id){
        return db.query('UPDATE professionals SET lastname= ?, firstname= ?, address=?, zip= ?, city= ?, phone= ?, details= ?, speciality_id= ? WHERE id= ?',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, req.body.speciality_id, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Suppression d'un professionnel (Page Admin)
    /*static deleteProfessional(id){
        return db.query('DELETE FROM professionals WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }*/

    static changeStatusProfessional(id){
        return db.query('UPDATE professionals SET isActive = NOT isActive WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    static displayProBySpe(speciality_id){
        return db.query('SELECT DISTINCT professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id WHERE professionals.speciality_id = ? AND professionals.isActive = 1', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            console.log(err)
            return err
        })
    }

    //Récupération des professionnels par spécialisation (Page des pros x9)
    /*static getProfessionnalBySpecialityId(speciality_id){
        return db.query('SELECT * FROM professionals INNER JOIN specializations ON professionals.speciality_id = specializations.id WHERE speciality_id = 1', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }*/


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

    //Récupération des dentistes, médecins et pharmacies et leurs horaires 
        static getProfessionalsGuards(){
            return db.query('SELECT professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, specializations.name_spe, days.day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning ON professionals.id= planning.pro_id JOIN specializations ON professionals.speciality_id =  specializations.id JOIN days ON planning.day_id = days.id WHERE specializations.name_spe IN ("Médecins", "Dentistes", "Pharmacies") AND professionals.isActive = 1  ORDER BY professionals.lastname, professionals.firstname, days.id')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                console.log(err)
                return err
            })
        }


}



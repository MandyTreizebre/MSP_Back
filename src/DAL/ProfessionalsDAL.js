module.exports = (_db) => {
    db = _db 
    return ProfessionalsDAL
}

class ProfessionalsDAL {
    // Obtenir les professionnels avec leurs horaires et leurs jours de travail
    static getProfessionalsAndHours(){
        return db.query('SELECT DISTINCT professionals.id, professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details, professionals.speciality_id, professionals.isActive, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir tous les professionnels
    static getProfessionals(){
        return db.query('SELECT id, lastname, firstname, address, zip, city, phone, details, speciality_id FROM professionals')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir un professionnel par son ID
    static GetProfessionalById(id){
        return db.query('SELECT lastname, firstname, address, zip, city, phone, details, speciality_id FROM professionals  WHERE id = ?',[id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Ajouter un nouveau professionnel
    static addProfessional(req){
        let defaultImage = "default-image-professional.png"

        return db.query('INSERT INTO professionals (lastname, firstname, address, zip, city, phone, details, speciality_id, picture)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, req.body.speciality_id, defaultImage])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Mettre à jour un professionnel
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

    // Modifier le statut d'un professionnel
    static changeStatusProfessional(id){
        return db.query('UPDATE professionals SET isActive = NOT isActive WHERE id = ?', [id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les professionnels par spécialisation
    static getProBySpe(speciality_id){
        return db.query('SELECT DISTINCT professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details,professionals.picture, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id WHERE professionals.speciality_id = ? AND professionals.isActive = 1', [speciality_id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir toutes les spécialisations
    static getSpecializations(){
        return db.query('SELECT id, name_spe, picture, key_url FROM specializations')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les professionnels avec leurs horaires et leurs jours de travail, en filtrant par spécialisation et par statut
    static getProfessionalsGuards(){
        return db.query('SELECT professionals.id, professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.isActive, professionals.picture, specializations.name_spe, days.day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning ON professionals.id= planning.pro_id JOIN specializations ON professionals.speciality_id =  specializations.id JOIN days ON planning.day_id = days.id WHERE specializations.name_spe IN ("Médecins", "Dentistes", "Pharmacies") AND professionals.isActive = 1  ORDER BY professionals.lastname, professionals.firstname, days.id')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }
}



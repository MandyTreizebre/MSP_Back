module.exports = (_db) => {
    db = _db
    return OpeningHoursModel
}

class OpeningHoursModel {

    // Récupération de tous les horaires 
    static getAllOpeningHours(){
        return db.query('SELECT * FROM opening_hours')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Récupération de tous les horaires par professionnel 
    static getOpeningHoursByProfessional(fk_pro_id){
        return db.query('SELECT * FROM opening_hours WHERE fk_pro_id = ?', [fk_pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Ajout d'un horaire
    static saveOpeningHours(req){
        return db.query('INSERT INTO opening_hours (day, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon, fk_pro_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [req.body.day, req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.body.fk_pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Modification d'un horaire 
    static updateOpeninghours(req, id){
        return db.query('UPDATE opening_hours SET day= ?, h_start_morning= ?, h_end_morning= ?, h_start_afternoon= ?, h_end_afternoon= ?, fk_pro_id= ? WHERE id= ?',
        [req.body.day, req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.body.fk_pro_id, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Suppresion d'un horaire 
    static deleteOpeningHours(id){
        return db.query('DELETE from opening_hours WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //essai
    static essai(speciality_id){
        return db.query('SELECT p.lastname, p.firstname, p.address, p.zip, p.city, p.phone, p.details, d.day_name AS day_name, pa.h_start_morning, pa.h_end_morning, pa.h_start_afternoon, pa.h_end_afternoon FROM professionals p JOIN planning pa ON pro_id = pa.pro_id JOIN days d on pa.day_id = d.id WHERE speciality_id = ?', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            console.log(err)
            return err
        })
    }
}
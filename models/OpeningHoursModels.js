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
    static getOpeningHoursByPro(pro_id){
        return db.query('SELECT * FROM planning WHERE pro_id = ?', [pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Ajout d'un horaire
    /*static saveOpeningHours(req){
        return db.query('INSERT INTO opening_hours (day, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon, fk_pro_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [req.body.day, req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.body.fk_pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }*/
    
    // Modification d'un horaire  OK VERIF
    static editProOpeningHours(req){
        return db.query('UPDATE planning SET h_start_morning= ?, h_end_morning= ?, h_start_afternoon= ?, h_end_afternoon= ? WHERE pro_id= ? AND day_id= ?',
        [req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.params.pro_id, req.body.day_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Suppresion d'un horaire 
    /*static deleteOpeningHours(id){
        return db.query('DELETE from opening_hours WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }*/

    //essai
    /*static displayProBySpe(speciality_id){
        return db.query('SELECT DISTINCT professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id WHERE professionals.speciality_id = ?', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            console.log(err)
            return err
        })
    }*/

    /* OK VERIF*/
    static addOpeningHours(req){
        return db.query('INSERT INTO planning (pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.pro_id, req.body.day_id, req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }



    static getDays(){
        return db.query('SELECT * FROM days')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
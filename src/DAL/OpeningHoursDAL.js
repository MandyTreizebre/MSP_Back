
module.exports = (_db) => {
    db = _db 
    return OpeningHoursDAL
}

class OpeningHoursDAL {

    // Obtenir toutes les horaires
    static getOpeningHours(){
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les horaires d'un professionnel et d'un jour
    static getOpeningHoursByProAndDay(pro_id, day_id){
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning WHERE pro_id = ? AND day_id = ?', [pro_id, day_id])
            .then((res)=>{
                return res
            })
        .catch((err)=>{
                return err
            })
    }

    // Ajouter des horaires
    static addOpeningHours(data){
        const { pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon }
         = data
        return db.query('INSERT INTO planning (pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon) VALUES (?, ?, ?, ?, ?, ?)',
        [pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Mettre à jours des horaires
    static udpateOpeningHours(req){
        return db.query('UPDATE planning SET h_start_morning= ?, h_end_morning= ?, h_start_afternoon= ?, h_end_afternoon= ? WHERE pro_id= ? AND day_id= ?',
        [req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.params.pro_id, req.body.day_id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les jours
    static getDays(){
        return db.query('SELECT id, day_name FROM days')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }
}
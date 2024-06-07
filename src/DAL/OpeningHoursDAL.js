//Export function to initialize DAL with database connection
module.exports = (_db) => {
    db = _db 
    return OpeningHoursDAL
}

class OpeningHoursDAL {

    // Get all opening hours from the database
    static getOpeningHours(){
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get opening hours by pro id
    static getOpeningHoursByProAndDay(pro_id, day_id){
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning WHERE pro_id = ? AND day_id = ?', [pro_id, day_id])
        .then((res)=>{
            console.log("Database Response:", res);
            return res
        })
        .catch((err)=>{
            console.error("Database Error:", err);
           return err
        })
    }

    //Add new opening hours to the database
    static addOpeningHours(data){
        const { pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon }
         = data
        return db.query('INSERT INTO planning (pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon) VALUES (?, ?, ?, ?, ?, ?)',
        [pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon])
        .then((res)=>{
            console.log("res dans addOpeningHours", res)
            return res
        })
        .catch((err)=>{
            console.log("err dans addOpeningHours", err)
            return err
        })
    }

    //Update existing opening_hours in the database
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

    //Get days from the database
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
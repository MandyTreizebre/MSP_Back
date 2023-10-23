/*Export function to initialize model with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return OpeningHoursModel
}

class OpeningHoursModel {
    // Get all opening hours from the database*/
    static getAllOpeningHours(){
        /*request to select rows from the planning table in database*/
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning')
        .then((res)=>{
            /*Return query result in case of success*/
            return res
        })
        .catch((err)=>{
            /*Return query result in case of error*/
            return err
        })
    }

    /*Get opening hours by pro id*/
    static getOpeningHoursByPro(pro_id){
        /*request to select rows from the planning table in database with the provided pro_id*/
        return db.query('SELECT pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon FROM planning WHERE pro_id = ?', [pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
           return err
        })
    }

    /*Add new opening hours to the database*/
    static addOpeningHours(req){
        /*request to insert into rows from the planning table in database*/
        return db.query('INSERT INTO planning (pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.pro_id, req.body.day_id, req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Update existing opening_hours in the database*/
    static udpateProOpeningHours(req){
        /*request to update rows from the planning table in database*/
        return db.query('UPDATE planning SET h_start_morning= ?, h_end_morning= ?, h_start_afternoon= ?, h_end_afternoon= ? WHERE pro_id= ? AND day_id= ?',
        [req.body.h_start_morning, req.body.h_end_morning, req.body.h_start_afternoon, req.body.h_end_afternoon, req.params.pro_id, req.body.day_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Get days from the database*/
    static getDays(){
        /*request to select rows from the days table in database*/
        return db.query('SELECT id, day_name FROM days')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
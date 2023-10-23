/*Export function to initialize model with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return ExternalProfessionals
}

class ExternalProfessionals {
    /*Get all external professionals from the database*/
    static getExternalPros(){
        /*Request to select rows from the external_professionals table in database*/
        return db.query('SELECT name, picture, link from external_professionals')
        .then((res)=>{
            /*Return query result in case of success*/
            return res
        })
        .catch((err)=>{
            /*Return query result in case of error*/
            return err
        })
    } 

    /*Add a new external professionals to the database*/
    static addExternalPro(req){
        /*Request to insert into rows from the external_professionals table in database*/
        return db.query('INSERT INTO external_professionals(name, picture, link) VALUES(?, ?, ?)',
        [req.body.name, req.body.picture, req.body.link])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Update an existing external professional in the database*/
    static updateExternalPro(req, id){
        /*request to update rows from the external_professionals table in database*/
        return db.query('UPDATE external_professionals SET name= ?, picture= ?, link= ? WHERE id= ?', 
        [req.body.name, req.body.picture, req.body.link, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Delete an existing external professional in the database*/
    static deleteExternalPro(id){
        /*request to delete a professional with the provided ID*/
        return db.query('DELETE FROM external_professionals WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
/*Export function to initialize model with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return HealthInformations
}

class HealthInformations {
    /*Get all informations from the database*/
    static getAllInformations(){
        /*Request to select rows from the health_informations table in database*/
        return db.query('SELECT title, description, image, link, category FROM health_informations')
        .then((res)=>{
            /*Return query result in case of success*/
            return res
        })
        .catch((err)=>{
            /*Return query result in case of error*/
            return err
        })
    }

    /*Get informations by category from the database*/
    static getInformationsByCategory(category){
        /*Request to select rows from health_informations table filtered by the provided category*/
        return db.query('SELECT title, description, image, link, category FROM health_informations INNER JOIN category_informations ON health_informations.category = category_informations.id WHERE category = ?', [category])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Get all categories from the database*/
    static getCategories(){
        /*Request to select rows from category_informations table*/
        return db.query('SELECT name, picture, name_url FROM category_informations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Add a new information to the database*/
    static addInformation(req){
        /*request to insert into rows from the health_informations table in database*/
        return db.query('INSERT INTO health_informations(title, description, image, link, category) VALUES(?, ?, ?, ?, ?)',
        [req.body.title, req.body.description, req.body.image, req.body.link, req.body.category])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Update an existing information in the database*/
    static updateInformation(id){
        /*Request to update rows the health_informations table in database*/
        return db.query('UPDATE health_informations SET title= ?, description= ?, image= ?, link= ?, category= ? WHERE id= ?', 
        [req.body.title, req.body.description, req.body.image, req.body.link, req.body.category, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Delete an existing information in the database*/
    static deleteInformation(id){
        /*request to delete an information with the provided ID*/
        return db.query('DELETE FROM health_informations WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
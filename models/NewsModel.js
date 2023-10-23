/*Export function to initialize model with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return NewsModel
}

class NewsModel {
    /*Get all news from the database*/
    static getAllNews(){
        /*Request to select rows from the news table in database*/
        return db.query('SELECT title, details, picture, external_link FROM news')
        .then((res)=>{
            /*Return query result in case of success*/
            return res
        })
        .catch((err)=>{
            /*Return query result in case of error*/
            return err
        })
    }

    /*Add a new to the database*/
    static addNew(){
        /*Request to insert into rows from the news table in database*/
        return db.query('INSERT INFO news(title, details, picture, external_link) VALUES(?, ?, ?, ?)',
        [req.body.title, req.body.details, req.body.picture, req.body.external_link])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Update an existing new in the database*/
    static updateNew(req, id){
        /*request to update rows from the news table in database*/
        return db.query('UPDATE news SET title= ?, details= ?, picture= ?, external_link= ? WHERE id= ?',
        [req.body.title, req.body.details, req.body.picture, req.body.external_link, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Delete an existing new in the database*/
    static deleteNew(id){
        /*request to delete a new with the provided ID*/
        return db.query('DELETE FROM news WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}

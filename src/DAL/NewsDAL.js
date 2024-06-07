//Export function to initialize DAL with database connection
module.exports = (_db) => {
    db = _db 
    return NewsDAL
}

class NewsDAL {
    //Get all news from the database
    static getNews(){
        return db.query('SELECT id, title, details, picture, external_link FROM news')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Get On New By Id 
    static getNewById(id){
        console.log("id dans le DAL => ", id)
        return db.query('SELECT id, title, details, picture, external_link FROM news WHERE id = ?', [id] )
        .then((res)=>{
            console.log("res dans getNewById", res)
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Add a new to the database
    static addNew(req){
        const title = req.body.title
        const details = req.body.details
        const external_link = req.body.external_link

        const picturePath = req.file ? `images/${req.file.filename}` : 'images/external_pro_default_picture.png'

        let query = 'INSERT INTO news (title, details, picture, external_link) VALUES(?, ?, ?, ?)'
        let queryParams = [title, details, picturePath, external_link]

        return db.query(query, queryParams)
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Update an existing new in the database
    static updateNew(req, id){

        const title = req.body.title
        const details = req.body.details 
        const external_link = req.body.external_link

        let query = 'UPDATE news SET title= ?, details= ?, external_link= ?'
        let queryParams = [title, details, external_link]

        if (req.file) {
            const picturePath = `images/${req.file.filename}`
            query += ', picture= ?'
            queryParams.push(picturePath)
        } 

        query += ' WHERE id= ?'
        queryParams.push(id)

        return db.query(query, queryParams)
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Delete an existing new in the database
    static deleteNew(id){
        return db.query('DELETE FROM news WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}

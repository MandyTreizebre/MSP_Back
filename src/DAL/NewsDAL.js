module.exports = (_db) => {
    db = _db 
    return NewsDAL
}

class NewsDAL {
    // Obtenir toutes les actualités
    static getNews(){
        return db.query('SELECT id, title, details, picture, external_link FROM news')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir une actualité par son ID
    static getNewById(id){
        return db.query('SELECT id, title, details, picture, external_link FROM news WHERE id = ?', [id] )
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Ajouter une actualité
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

    // Mettre à jour une actualité
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

    // Supprimer une actualité
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

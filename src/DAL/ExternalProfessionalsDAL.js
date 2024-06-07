module.exports = (_db) => {
    db = _db
    return ExternalProfessionalsDAL
}

class ExternalProfessionalsDAL {
    //Get all external professionals from the database
    static getExternalPros(){
        return db.query('SELECT id, name, picture, link from external_professionals')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get external Pro By ID 
    static getExternalProById(id){
        return db.query('SELECT id, name, picture, link FROM external_professionals WHERE id = ?',[id] )
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Add new external professional
    static addExternalPro(req){
        const name = req.body.name
        const link = req.body.link
        
        // Use 'default.jpg' (or your default file name) if no file is uploaded
        const picturePath = req.file ? `images/${req.file.filename}` : 'images/external_pro_default_picture.png'
    
        let query = 'INSERT INTO external_professionals (name, link, picture) VALUES (?, ?, ?)'
        let queryParams = [name, link, picturePath]
    
        return db.query(query, queryParams)
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
        })
    }

    // Update an existing external professional 
    static updateExternalPro(req, id) {
        const name = req.body.name
        const link = req.body.link
        
        let query = 'UPDATE external_professionals SET name= ?, link= ?'
        let queryParams = [name, link]
    
        // Check if an image has been downloaded
        if (req.file) {
            const picturePath = req.file ? `images/${req.file.filename}` : null
            query += ', picture= ?' 
            queryParams.push(picturePath)
        }
    
        query += ' WHERE id= ?'
        queryParams.push(id)
    
        return db.query(query, queryParams)
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
    }

    //Delete an existing external professional 
    static deleteExternalPro(id){
        return db.query('DELETE FROM external_professionals WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
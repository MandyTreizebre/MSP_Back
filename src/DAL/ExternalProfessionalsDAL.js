module.exports = (_db) => {
    db = _db
    return ExternalProfessionalsDAL
}

class ExternalProfessionalsDAL {
    // Obtenir les professionnels externes
    static getExternalPros(){
        return db.query('SELECT id, name, picture, link from external_professionals')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir un professionnel externe par son ID
    static getExternalProById(id){
        return db.query('SELECT id, name, picture, link FROM external_professionals WHERE id = ?',[id] )
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Ajouter un nouveau professionnel externe
    static addExternalPro(req){
        const name = req.body.name
        const link = req.body.link
        
        // Utiliser l'image par défaut si aucune image n'est uploadé
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

    // Mettre à jour un professionnel externe
    static updateExternalPro(req, id) {
        const name = req.body.name
        const link = req.body.link
        
        let query = 'UPDATE external_professionals SET name= ?, link= ?'
        let queryParams = [name, link]
    
        // Vérification de l'image
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

    // Supprimer un professionnel externe
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
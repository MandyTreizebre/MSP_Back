/*Export function to initialize model with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return ExternalProfessionals
}

class ExternalProfessionals {
    /*Get all external professionals from the database*/
    static getExternalPros(){
        /*Request to select rows from the external_professionals table in database*/
        return db.query('SELECT id, name, picture, link from external_professionals')
        .then((res)=>{
            /*Return query result in case of success*/
            return res
        })
        .catch((err)=>{
            /*Return query result in case of error*/
            return err
        })
    }

    static getExternalProfessionalById(id){
        return db.query('SELECT id, name, picture, link FROM external_professionals WHERE id = ?',[id] )
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    /*Add a new external professionals to the database*/
    static addExternalPro(req){
        const name = req.body.name;
        const link = req.body.link;
        // Utilisez 'default.jpg' (ou le nom de votre fichier par défaut) si aucun fichier n'est téléchargé
        const picturePath = req.file ? `images/${req.file.filename}` : 'images/external_pro_default_picture.png'
    
        let query = 'INSERT INTO external_professionals (name, link, picture) VALUES (?, ?, ?)'
        let queryParams = [name, link, picturePath]
    
        return db.query(query, queryParams)
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            });
    }

    /*Update an existing external professional in the database*/
    static updateExternalPro(req, id) {
        const name = req.body.name
        const link = req.body.link
        let query = 'UPDATE external_professionals SET name= ?, link= ?';
        let queryParams = [name, link];
    
        // Vérifiez si une image a été téléchargée
        if (req.file) {
            const picturePath = req.file ? `images/${req.file.filename}` : null;
            query += ', picture= ?'; // Ajoutez la colonne picture à la mise à jour
            queryParams.push(picturePath);
        }
    
        query += ' WHERE id= ?';
        queryParams.push(id);
    
        return db.query(query, queryParams)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
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
module.exports = (_db) => {
    db = _db 
    return HealthInformationsDAL
}

class HealthInformationsDAL {
    // Obtenir toutes les informations
    static getInformations(){
        return db.query('SELECT id, title, description, image, link, category FROM health_informations')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir une information par ID
    static getOneInformationById(id){
        return db.query('SELECT id, title, description, image, link, category FROM health_informations WHERE id = ?', [id] )
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les informations par catégorie
    static getInformationsByCategory(category){
        return db.query('SELECT title, description, image, link, category FROM health_informations INNER JOIN category_informations ON health_informations.category = category_informations.id WHERE category = ?', [category])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Obtenir les catégories
    static getCategories(){
        return db.query('SELECT id, name, picture FROM category_informations')
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }

    // Ajouter une information
    static addInformation(req){
        const title = req.body.title
        const description = req.body.description
        const link = req.body.link
        const category = req.body.category

        if (!req.body.category || isNaN(parseInt(req.body.category, 10))) {
            return res.status(400).json({ msg: "La catégorie est invalide ou manquante" })
        }

        const picturePath = req.file ? `images/${req.file.filename}` : 'default-image-informations.jpg'
        
        let query = 'INSERT INTO health_informations(title, description, image, link, category) VALUES(?, ?, ?, ?, ?)'
        let queryParams = [title, description, picturePath, link, category]

        return db.query(query, queryParams)
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
        })
    }

    // Mettre à jour une information
    static updateInformation(req, id) {
    
        const title = req.body.title
        const description = req.body.description
        const link = req.body.link
        const category = req.body.categories 

        let query = 'UPDATE health_informations SET title= ?, description= ?, link= ?, category= ?'
        let queryParams = [title, description, link, category]

        if (req.file) {
            const picturePath = `images/${req.file.filename}`
            query += ', image= ?'
            queryParams.push(picturePath)
        } else if (req.body.existingImage) {
            query += ', image= ?'
            queryParams.push(req.body.existingImage)
        }

        query += ' WHERE id= ?'
        queryParams.push(id)

        return db.query(query, queryParams)
            .then(res => res)
            .catch(err => err)
    }

    // Supprimer une information
    static deleteInformation(id){
        return db.query('DELETE FROM health_informations WHERE id= ?', [id])
            .then((res)=>{
                return res
            })
            .catch((err)=>{
                return err
            })
    }
}
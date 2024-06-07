/*Export function to initialize DAL with database connection*/
module.exports = (_db) => {
    db = _db /*Assign database connection to a global variable db*/
    return HealthInformationsDAL
}

class HealthInformationsDAL {
    // Get all informations from the database
    static getInformations(){
        return db.query('SELECT id, title, description, image, link, category FROM health_informations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get informations by ID
    static getOneInformationById(id){
        return db.query('SELECT id, title, description, image, link, category FROM health_informations WHERE id = ?', [id] )
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Get informations by category from the database
    static getInformationsByCategory(category){
        return db.query('SELECT title, description, image, link, category FROM health_informations INNER JOIN category_informations ON health_informations.category = category_informations.id WHERE category = ?', [category])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Get all categories from the database
    static getCategories(){
        return db.query('SELECT id, name, picture FROM category_informations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Add a new information to the database
    static addInformation(req){
        const title = req.body.title
        const description = req.body.description
        const link = req.body.link
        const category = req.body.category

        if (!req.body.category || isNaN(parseInt(req.body.category, 10))) {
            return res.status(400).json({ msg: "La catégorie est invalide ou manquante" })
        }

        let defaultImage = "default-image-informations.jpg"
        
        let query = 'INSERT INTO health_informations(title, description, image, link, category) VALUES(?, ?, ?, ?, ?)'
        let queryParams = [title, description, defaultImage, link, category]

        return db.query(query, queryParams)
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
        })
    }

    // Update an existing information in the database
    static updateInformation(req, id) {
    
        const title = req.body.title
        const description = req.body.description
        const link = req.body.link
        const category = req.body.categories 

        let query = 'UPDATE health_informations SET title= ?, description= ?, link= ?, category= ?'
        let queryParams = [title, description, link, category]

        if (req.file) {
            const picturePath = `images/${req.file.filename}`
            query += ', image= ?';
            queryParams.push(picturePath);
        } else if (req.body.existingImage) {
            query += ', image= ?';
            queryParams.push(req.body.existingImage);
        }

        query += ' WHERE id= ?';
        queryParams.push(id);

        return db.query(query, queryParams)
            .then(res => res)
            .catch(err => err);
    }

    //Delete an existing information in the database
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
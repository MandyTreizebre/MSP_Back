module.exports = (_db) => {
    db = _db
    return HealthInformations
}

class HealthInformations {

    //Récupération de toutes les infos 
    static getAllInformations(){
        return db.query('SELECT * FROM health_informations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des informations par catégorie 
    static getInformationsByCategory(category){
        return db.query('SELECT * FROM health_informations INNER JOIN category_informations ON health_informations.category = category_informations.id WHERE category = ?', [category])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Récupération des catégories 
    static getCategories(){
        return db.query('SELECT * FROM category_informations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    static editInformation(id){
        return db.query('UPDATE health_informations SET title= ?, description= ?, image= ?, link= ?, category= ? WHERE id= ?', 
        [req.body.title, req.body.description, req.body.image, req.body.link, req.body.category, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
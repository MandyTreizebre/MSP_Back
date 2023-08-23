module.exports = (_db) => {
    db = _db
    return NewsModel
}

class NewsModel {

    // Récupération de tous les horaires 
    static getAllNews(){
        return db.query('SELECT * FROM news')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}

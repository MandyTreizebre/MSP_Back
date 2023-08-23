module.exports = (app, db)=>{
    const newsModel = require('../models/NewsModel')(db)

    //route permettant de récupérer toutes les actualités 
    app.get('/news', async(req, res, next)=>{
        let news = await newsModel.getAllNews()
        if(news.code){
            res.json({status: 500, msg: "Problème lors de la récupération des actualités"})
        } else {
            res.json({status: 200, result: news})
        }
    })

}
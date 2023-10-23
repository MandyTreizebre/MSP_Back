/*Importing the authentication middleware*/
const withAuth = require('../withAuth')

module.exports = (app, db)=>{
    /*Import and initialize NewsModel with database connection*/
    const newsModel = require('../models/NewsModel')(db)

    /*GET route to retrieve all news*/
    app.get('/news', async(req, res, next)=>{
        /*Call the model's getAllNewss method to retrieve news*/
        let news = await newsModel.getAllNews()
        /*Check whether an error has occurred during the database query*/
        if(news.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des actualités"})
        } else {
            /*Send response with 200 status and news in case of success*/
            res.json({status: 200, result: news})
        }
    })

    /*POST to add a new*/
    app.post('/save-new', withAuth, async(req, res, next)=>{
        /*Call the model's addNew() method to add a new*/
        let addNew = await newsModel.addNew()
        if(addNew.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de l'ajoutde l'actualité", err: addNew})
        }else{
            /*Send response with 201 status and news in case of success*/
    		res.json({status: 201, msg: "Actualité enregistrée" , result: addNew})
    	}
    })

    /*PUT to modify a new*/
    app.put('/update-new/:id', async (req, res, next)=>{
        /*Call the model's updateNew method to update a new*/
        let editedNew = await newsModel.updateNew(req, req.params.id)
        /*Check whether an error has occurred during the database query*/
        if(editedNew.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la modification de l'actualité"})
        } else {
            /*Send response with 200 status and news in case of success*/
            res.json({status: 200, msg: "Actualité modifiée", result: editedNew})
        }
    })

    /*DELETE a new*/
    app.delete('/delete-new/:id', async (req, res, next)=>{
        /*Call the model's deleteNew method to delete a new*/
            let deletedNew = await newsModel.deleteNew(req.params.id)
            if(deletedNew.code){
                /*Send response with status 500 in case of error*/
                res.json({status: 500, msg: "Problème lors de la suppresion de l'actualité"})
            } else {
                /*Send response with 200 status and new in case of success*/
                res.json({status: 200, msg: "Actualité supprimée", result: deletedNew})
            }
        })
}
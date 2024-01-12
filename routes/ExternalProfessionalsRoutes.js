/*Importing the authentication middleware*/
const withAuth = require('../withAuth')
const multerErrorHandler = require('../multerErrorHandler')

module.exports = (app, db)=>{
    /*Import and initialize ExternalProfessionalsModel with database connection*/
    const externalProfessionalsModel = require('../models/ExternalProfessionalsModel')(db)

    /*GET route to retrieve all external professionals*/
    app.get('/external-professionals', async(req, res, next)=>{
        /*Call the model's getExternalPros method to retrieve external professionals*/
        let allExternalPros = await externalProfessionalsModel.getExternalPros()
        /*Check whether an error has occurred during the database query*/
        if(allExternalPros.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels externes"})
        } else {
            /*Send response with 200 status and external professionals in case of success*/
            res.json({status: 200, result: allExternalPros})
        }
    })

    app.get('/api/external-professional/:id', async (req, res, next)=>{
        let externalProById = await externalProfessionalsModel.getExternalProfessionalById(req.params.id)
        if(externalProById.length === 0){
            res.json({status: 204, msg: "Il n'y a pas de professionnal externa correspondant à cet id"})
        } else {
            if(externalProById.code){
                res.json({status: 500, msg: "Problème lors de la récupération des professionnels externes"})
            } else {
                res.json({status: 200, result: externalProById})
            }
        }
    })

    /*Route POST to add an external professional*/
    app.post('/save-external-professional', withAuth, multerErrorHandler, async(req, res, next)=>{
        /*Call the model's addExternalPro method to add an external professional*/
        let addExternalPros = await externalProfessionalsModel.addExternalPro(req)
        /*Check whether an error has occurred during the database query*/
        if(addExternalPros.code){
            console.log(addExternalPros.code)
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de l'ajout du professionnel"})
        } else {
            /*Send response with 201 status and external professionals in case of success*/
            res.json({status: 201, msg: "Professionnel ajouté", result: addExternalPros})
        }
    })

    /*Route PUT to modify an external professional*/
    app.put('/update/external-pro/:id', withAuth, multerErrorHandler, async (req, res, next)=>{
        /*Call the model's updateExternalPro method to modify an external professional*/
        let updatedExternalPro = await externalProfessionalsModel.updateExternalPro(req, req.params.id)
        /*Check whether an error has occurred during the database query*/
        if(updatedExternalPro.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
        } else {
            /*Send response with 200 status and external professionals in case of success*/
            res.json({status: 200, result: updatedExternalPro})
        }
    })

    /*Route DELETE to delete an external professional*/
    app.delete('/delete/external-pro/:id', withAuth, async (req, res, next)=>{
        /*Calling the template's deleteExternalPro method to delete an external professional*/
        let deletedExternalPro = await externalProfessionalsModel.deleteExternalPro(req.params.id)
        /*Check whether an error has occurred during the database query*/
        if(deletedExternalPro.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la suppression du professionnel"})
        } else {
            /*Send response with 200 status and external professionals in case of success*/
            res.json({status: 200, result: deletedExternalPro})
        }
    })
}
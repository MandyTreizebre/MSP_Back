/*Importing the authentication middleware*/
const withAuth = require('../withAuth')

module.exports = (app,db)=>{
    /*Import and initialize HealthInformationsModel with database connection*/
    const healthInformationsModel = require('../models/HealthInformationsModel')(db)
    
    /*GET route to retrieve all informations*/
    app.get('/informations', async (req, res, next) => {
        /*Call the model's getAllInformations method to retrieve informations*/
    	let infos = await healthInformationsModel.getAllInformations()
        /*Check whether an error has occurred during the database query*/
    	if(infos.code){
            /*Send response with status 500 in case of error*/
    		res.json({status: 500, msg: "Problème lors de la récupération des informations", err: infos})
    	}else{
            /*Send response with 200 status and informations in case of success*/
    		res.json({status: 200, result: infos})
    	}
    })

    /*GET route to retrieve informations by category*/ 
    app.get('/informations-category/:category', async (req, res, next)=> {
        /*Call the model's getInformationsByCategory method to retrieve informations*/
        let infosByCategory = await healthInformationsModel.getInformationsByCategory(req.params.category)
        /*Check whether an error has occurred during the database query*/
        if (infosByCategory.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des informations", err: infosByCategory})
        }else{
            /*Send response with 200 status and informations in case of success*/
    		res.json({status: 200, result: infosByCategory})
    	}
    })

    /*GET route to retrieve categories*/ 
    app.get('/categories', async (req, res, next)=> {
        /*Call the model's getCategories method to retrieve categories*/
        let categories = await healthInformationsModel.getCategories()
        /*Check whether an error has occurred during the database query*/
        if (categories.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des informations", err: categories})
        }else{
            /*Send response with 200 status and informations in case of success*/
    		res.json({status: 200, result: categories})
    	}
    })

    /*POST to add an information*/
    app.post('/save-information', withAuth, async(req, res, next)=>{
        /*Call the model's addInformation method to add an information*/
        let addInformation = await healthInformationsModel.addInformation(req)
        /*Check whether an error has occurred during the database query*/
        if (addInformation.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des informations", err: addInformation})
        }else{
            /*Send response with 201 status and informations in case of success*/
    		res.json({status: 201, msg: "Information enregistrée", result: addInformation})
    	}
    })

    /*PUT to modify an information*/
    app.put('/update-information/:id', async (req, res, next)=>{
        /*Call the model's updateInformation method to update an information*/
        let editedInformation = await healthInformationsModel.updateInformation(req, req.params.id)
        /*Check whether an error has occurred during the database query*/
        if(editedInformation.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la modification de l'information"})
        } else {
            /*Send response with 200 status and informations in case of success*/
            res.json({status: 200, msg: "Information modifiée", result: editedInformation})
        }
    })

    /*DELETE an information*/
    app.delete('/delete-information/:id', async (req, res, next)=>{
    /*Call the model's deleteInformation method to update an information*/
        let deletedInformation = await healthInformationsModel.deleteInformation(req.params.id)
        if(deletedInformation.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la suppresion de l'information"})
        } else {
            /*Send response with 200 status and informations in case of success*/
            res.json({status: 200, msg: "Information supprimée", result: deletedInformation})
        }
    })
}

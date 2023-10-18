module.exports = (app,db)=>{
    const healthInformations = require('../models/HealthInformationsModel')(db)
    
    //route permettant de récupérer toutes les informations
    app.get('/informations', async (req, res, next) => {
    	let infos = await healthInformations.getAllInformations()
    	if(infos.code){
    		res.json({status: 500, msg: "Problème lors de la récupération des informations", err: infos})
    	}else{
    		res.json({status: 200, result: infos})
    	}
    })

    //route permettant de récupérer les informations par catégorie 
    app.get('/informations-category/:category', async (req, res, next)=> {
        let infosByCategory = await healthInformations.getInformationsByCategory(req.params.category)
        if (infosByCategory.code){
            res.json({status: 500, msg: "Problème lors de la récupération des informations", err: infosByCategory})
        }else{
    		res.json({status: 200, result: infosByCategory})
    	}
    })

    app.get('/categories', async (req, res, next)=> {
        let categories = await healthInformations.getCategories()
        if (categories.code){
            console.log(categories.code)
            res.json({status: 500, msg: "Problème lors de la récupération des informations", err: categories})
        }else{
    		res.json({status: 200, result: categories})
    	}
    })

    app.put('/edit/information/:id', async (req, res, next)=>{
        let editedInformation = await healthInformations.editInformation(req, req.params.id)
        if(editedInformation.code){
            res.json({status: 500, msg: "Problème lors de la modification de l'information"})
        } else {
            res.json({status: 200, msg: "Information modifiée", result: editedInformation})
        }
    })
}
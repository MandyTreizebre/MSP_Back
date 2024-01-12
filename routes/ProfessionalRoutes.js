/*Importing the authentication middleware*/
const withAuth = require('../withAuth')

module.exports = (app,db)=>{
    /*Import and initialize ProfessionalsModel with database connection*/
    const professionalsModel = require('../models/ProfessionalsModel')(db)
    
    /*GET route to retrieve all professionals and their opening hours*/
    app.get('/api/professionals-and-hours', async (req, res, next) => {
        /*Call the model's getAllProfessionalsAndHours method to retrieve pros and hours*/
    	let prosAndHours = await professionalsModel.getAllProfessionalsAndHours()
    	/*Check whether an error has occurred during the database query*/
        if(prosAndHours.code){
            /*Send response with status 500 in case of error*/
    		res.json({status: 500, msg: "Problème lors de la récupération des professionnels et de leurs horaires", err: prosAndHours})
    	}else{
            /*Send response with 200 status and pros + hours in case of success*/
    		res.json({status: 200, result: prosAndHours})
    	}
    })

    /*GET route to retrieve all professionals*/
    app.get('/api/professionals', async (req, res, next) => {
        /*Call the model's getProfessionals method to retrieve professionals*/
    	let pros = await professionalsModel.getProfessionals()
        /*Check whether an error has occurred during the database query*/
    	if(pros.code){
            /*Send response with status 500 in case of error*/
    		res.json({status: 500, msg: "Problème lors de la récupération des professionnels", err: pros})
    	}else{
            /*Send response with 200 status and informations in case of success*/
    		res.json({status: 200, result: pros})
    	}
    })

    
    /*GET route to retrieve professional by his ID*/ 
    app.get('/api/professional/:id', async (req, res, next)=>{
        /*Call the model's getProfessionalById method to retrieve a professional*/
        let prosById = await professionalsModel.GetProfessionalById(req.params.id)
        /*Check if the ID exists*/
        if(prosById.length === 0){
            res.json({status: 204, msg: "Il n'y a pas de professionnel correspondant à cet ID"})
        } else {
            /*Check whether an error has occurred during the database query*/
            if(prosById.code){
                /*Send response with status 500 in case of error*/
                res.json({status:500, msg: "Problème lors de la récupération de ce professionnel"})
            } else {
                /*Send response with 200 status and professional in case of success*/
                res.json({status:200, result: prosById})
            }
        }
    })

    /*POST to add a professional in the database */
    app.post('/api/save/pro', withAuth, async (req, res, next)=>{
        /*Validating input for saving a professional :*/
        if (!req.body.lastname || req.body.lastname.length > 100) {
            return res.status(400).json({ status: 400, msg: "Nom invalide" })
        }
        if (!req.body.firstname || req.body.firstname.length > 50) {
            return res.status(400).json({ status: 400, msg: "Prénom invalide" })
        }
        if (!req.body.address || req.body.address.length > 50) {
            return res.status(400).json({ status: 400, msg: "Addresse invalide" })
        }
        if (!req.body.zip || req.body.zip.length > 5) {
            return res.status(400).json({ status: 400, msg: "Code postal invalide" })
        }
        if (!req.body.city || req.body.city.length > 50) {
            return res.status(400).json({ status: 400, msg: "Ville invalide" })
        }
        if (!req.body.phone || req.body.phone.length > 10) {
            return res.status(400).json({ status: 400, msg: "Téléphone invalide" })
        }
        if (!req.body.details || req.body.details > 100) {
            return res.status(400).json({ status: 400, msg: "Détails invalide" })
        }

        try {
            /*Call the model's addPro method to add a professional*/
            let addPro = await professionalsModel.addProfessional(req)
            /*Check whether an error has occurred during the database query*/
            if(addPro.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "problème lors de la création du professionnel"})
            } else {
                /*Send response with 201 status and the professional in case of success*/
                res.json({status: 201, msg: "Professionnel créer", result: addPro})
            }
        } catch (error) {
            /*send a response with status 500 in case of an exception*/
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    /*PUT to modify a professional*/
    app.put('/api/edit/pro/:id', withAuth, async (req, res, next)=>{
        /*Validating input for modify the professional :*/
        if (!req.body.lastname || req.body.lastname.length > 100) {
            return res.status(400).json({ status: 400, msg: "Nom invalide" })
        }
        if (!req.body.firstname || req.body.firstname.length > 50) {
            return res.status(400).json({ status: 400, msg: "Prénom invalide" })
        }
        if (!req.body.address || req.body.address.length > 50) {
            return res.status(400).json({ status: 400, msg: "Addresse invalide" })
        }
        if (!req.body.zip || req.body.zip.length > 5) {
            return res.status(400).json({ status: 400, msg: "Code postal invalide" })
        }
        if (!req.body.city || req.body.city.length > 50) {
            return res.status(400).json({ status: 400, msg: "Ville invalide" })
        }
        if (!req.body.phone || req.body.phone.length > 14) {
            return res.status(400).json({ status: 400, msg: "Téléphone invalide" })
        }
        if (!req.body.details || req.body.details > 100) {
            return res.status(400).json({ status: 400, msg: "Détails invalide" })
        }

        try {
            /*Call the model's updateProfessional method to update a professional*/
            let updatedPro = await professionalsModel.updateProfessional(req, req.params.id)
            /*Check whether an error has occurred during the database query*/
            if(updatedPro.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
            } else {
                /*Send response with 200 status and updated professional in case of success*/
            res.json({status: 200, msg: "Professionnel modifié", result: updatedPro})
            } 
        } catch (error) {
            /*send a response with status 500 in case of an exception*/
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    /*Route to update the status of a professional (isActive or not)*/
    app.put('/api/status/pro/:id', withAuth, async (req, res, next)=>{
        /*Call the model's changeStatusProfessional method to update the status*/
        let statusChanged = await professionalsModel.changeStatusProfessional(req.params.id)
        /*Check whether an error has occurred during the database query*/
        if(statusChanged.code){
            /*Send response with status 500 in case of error*/
            res.json({status:500, msg: "Problème lors de la désactivation du professionnel"})
        } else {
            /*Send response with 200 status and new in case of success*/
            res.json({status:200, msg: "Changement du status du professionnel", result: statusChanged})
        }
    })

    /*Get route to retrieve professionals by their specializations*/
    app.get('/api/pro/:speciality_id', async (req, res, next)=> {
        const specialityId = parseInt(req.params.speciality_id)

        if (isNaN(specialityId)){
            res.status(404).json({ status: 404, msg: "Page non trouvée" });
            return;
        }
        /*Call the model's getProBySpe method to get professionals*/
        let pro = await professionalsModel.getProBySpe(req.params.speciality_id)
        /*Check whether an error has occurred during the database query*/
        if(pro.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels"})
        } else {
            /*Send response with 200 status and professionals in case of success*/
            res.json({status: 200, msg: "Professionnels récupérés", result: pro})
        }
    })

    /* Get route to retrieve all specializations*/
    app.get('/api/specializations', async (req, res, next)=>{
        /*Call the model's getAllSpecializations method get the specializations*/
        let specializations = await professionalsModel.getAllSpecializations()
            /*Check whether an error has occurred during the database query*/
        if(specializations.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des spécialisations"})
        } else {
            /*Send response with 200 status and specializations in case of success*/
            res.json({status: 200, msg: "Spécialisation récupérées", result: specializations})
        }
    })

    /*Get route to retrieve professionals who are on guard*/
    app.get('/api/professionals-guards', async (req, res, next)=> {
        /*Call the model's getProfessionalsGuards method to get only the doctors, dentists and pharmacies*/
        let pros = await professionalsModel.getProfessionalsGuards()
        /*Check whether an error has occurred during the database query*/
        if(pros.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels de gardes"})
        } else {
            /*Send response with 200 status and pros on guard in case of success*/
            res.json({status: 200, msg: "Professionnels de gardes récupérées", result: pros})
        }
    })
}
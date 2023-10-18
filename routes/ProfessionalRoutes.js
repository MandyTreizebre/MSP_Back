const withAuth = require('../withAuth')

module.exports = (app,db)=>{
    const professionalsModel = require('../models/ProfessionalsModel')(db)
    
    //route permettant de récupérer tous les professionnels
    app.get('/professionals', async (req, res, next) => {
    	let pros = await professionalsModel.getAllProfessionals()
    	if(pros.code){
    		res.json({status: 500, msg: "Problème lors de la récupération des professionnels", err: pros})
    	}else{
    		res.json({status: 200, result: pros})
    	}
    })

    app.get('/only-professionals', async (req, res, next) => {
    	let pros = await professionalsModel.getOnlyProfessionals()
    	if(pros.code){
    		res.json({status: 500, msg: "Problème lors de la récupération des professionnels", err: pros})
    	}else{
    		res.json({status: 200, result: pros})
    	}
    })

    
    //route permettant de récupérer les pros par leurs id
    app.get('/professional/:id', async (req, res, next)=>{
        let prosById = await professionalsModel.GetProfessionalById(req.params.id)
        if(prosById.length === 0){
            res.json({status: 204, msg: "Il n'y a pas de professionnel correspondant à cet ID"})
        } else {
            if(prosById.code){
                res.json({status:500, msg: "Problème lors de la récupération de ce professionnel"})
            } else {
                res.json({status:200, result: prosById})
            }
        }
    })

    //route permettant d'ajouter un professionnel (Admin) OK VERIF
    app.post('/save/pro', withAuth, async (req, res, next)=>{
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
            return res.status(400).json({ status: 400, msg: "Code posta invalide" })
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
            let addPro = await professionalsModel.addProfessional(req)

            if(addPro.code){
            res.json({status: 500, msg: "problème lors de la création du professionnel"})
            } else {
                res.json({status: 201, msg: "Professionnel créer", result: addPro})
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du professionnel:", error)
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    //route permettant de modifier un professionnel OK VERIF
    app.put('/edit/pro/:id', withAuth, async (req, res, next)=>{
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
            return res.status(400).json({ status: 400, msg: "Code posta invalide" })
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
            let updatedPro = await professionalsModel.updateProfessional(req, req.params.id)
            
            if(updatedPro.code){
            res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
            } else {
            res.json({status: 200, msg: "Professionnel modifié", result: updatedPro})
            } 
        } catch (error) {
            console.error("Erreur lors de la modification du professionnel:", error)
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    //route permettant de supprimer un professionnel 
    app.delete('/delete/pro/:id', async (req, res, next)=>{
        let deletedPro = await professionalsModel.deleteProfessional(req.params.id)
        if(deletedPro.code){
            console.log("CONSOLE DANS ROUTE DELETED PRO", deletedPro.code)
            res.json({status:500, msg: "Problème lors de la suppression du professionnel"})
        } else {
            res.json({status:200, msg: "Professionnel supprimé", result: deletedPro})
        }
    })

    app.put('/status/pro/:id', withAuth, async (req, res, next)=>{
        let statusChanged = await professionalsModel.changeStatusProfessional(req.params.id)
        if(statusChanged.code){
            res.json({status:500, msg: "Problème lors de la désactivation du professionnel"})
        } else {
            res.json({status:200, msg: "Changement du status du professionnel", result: statusChanged})
        }
    })

    app.get('/pro/:speciality_id', async (req, res, next)=> {
        let pro = await professionalsModel.displayProBySpe(req.params.speciality_id)
        if(pro.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires"})
        } else {
            res.json({status: 200, result: pro})
        }
    })

    //route permettant de récupérer des professionnel par spécialisation
    /*app.get('/pro/category/:speciality_id', async (req, res, next)=>{
        let proByCategory = await professionalsModel.getProfessionnalBySpecialityId(req.params.speciality_id)
        if(proByCategory.code){
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels"})
        } else {
            res.json({status:200, msg: "Professionnel récupéré", result: proByCategory})
        }
    })*/

    //route de récupération des spécialisations 
    app.get('/specializations', async (req, res, next)=>{
        let specializations = await professionalsModel.getAllSpecializations()
        if(specializations.code){
            res.json({status: 500, msg: "Problème lors de la récupération des spécialisations"})
        } else {
            res.json({status: 200, msg: "Spécialisation récupérées", result: specializations})
        }
    })

    app.get('/professionnels-de-garde', async (req, res, next)=> {
        let pros = await professionalsModel.getProfessionalsGuards()
        if(pros.code){
            console.log(pros.code)
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels de gardes"})
        } else {
            res.json({status: 200, msg: "Professionnels de gardes récupérées", result: pros})
        }
    })
}
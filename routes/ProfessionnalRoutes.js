module.exports = (app,db)=>{
    const professionalModel = require('../models/ProfessionnalModel')(db)
    
    //route permettant de récupérer tous les professionnels
    app.get('/pros/all', async (req, res, next) => {
    	let pros = await professionalModel.getAllProfessionals()
    	if(pros.code){
    		res.json({status: 500, msg: "Problème lors de la récupération des professionnels", err: pros})
    	}else{
    		res.json({status: 200, result: pros})
    	}
    })

    //route permettant de récupérer les pros par leurs id
    app.get('/pros/:id', async (req, res, next)=>{
        let prosById = await professionalModel.GetProfessionalById(req.params.id)
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

    //route permettant d'ajouter un professionnel
    app.post('/add/pros', async (req, res, next)=>{
        let addPro = await professionalModel.addProfessional(req)
        if(addPro.code){
            res.json({status: 500, msg: "problème lors de la création du professionnel"})
        } else {
            res.json({status: 200, msg: "Professionnel enregistré", result: addPro})
        }
    })

    //route permettant de modifier un professionnel
    app.put('/update/pros/:id', async (req, res, next)=>{
        let updatedPro = await professionalModel.updateProfessional(req, req.params.id)
        if(updatedPro.code){
            res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
        } else {
            res.json({status: 200, msg: "Professionnel modifié", result: updatedPro})
        }
    })

    //route permettant de supprimer un professionnel 
    app.delete('/delete/pros/:id', async (req, res, next)=>{
        let deletedPro = await professionalModel.deleteProfessional(req.params.id)
        if(deletedPro.code){
            res.json({status:500, msg: "Problème lors de la suppression du professionnel"})
        } else {
            res.json({status:200, msg: "Professionnel supprimé", result: deletedPro})
        }
    })

    //route permettant de récupérer des professionnel par spécialisation
    app.get('/pros/categorie/:specialitee_id', async (req, res, next)=>{
        let proByCategorie = await professionalModel.getProfessionnalBySpecialiteeId(req.params.specialitee_id)
        if(proByCategorie.code){
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels"})
        } else {
            res.json({status:200, msg: "Professionnel récupéré", result: proByCategorie})
        }
    })

    //route de récupération des spécialisations 
    app.get('/all/specialisations', async (req, res, next)=>{
        let specialisations = await professionalModel.getAllSpecialisation()
        if(specialisations.code){
            res.json({status: 500, msg: "Problème lors de la récupération des spécialisations"})
        } else {
            res.json({status: 200, msg: "Spécialisation récupérées", result: specialisations})
        }
    })
}
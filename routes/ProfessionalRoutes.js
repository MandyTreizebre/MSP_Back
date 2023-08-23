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

    //route permettant d'ajouter un professionnel (Admin)
    app.post('/save/pro', async (req, res, next)=>{
        let addPro = await professionalsModel.addProfessional(req)
        if(addPro.code){
            res.json({status: 500, msg: "problème lors de la création du professionnel"})
        } else {
            res.json({status: 200, msg: "Professionnel enregistré", result: addPro})
        }
    })

    //route permettant de modifier un professionnel
    app.put('/update/pro/:id', async (req, res, next)=>{
        let updatedPro = await professionalsModel.updateProfessional(req, req.params.id)
        if(updatedPro.code){
            res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
        } else {
            res.json({status: 200, msg: "Professionnel modifié", result: updatedPro})
        }
    })

    //route permettant de supprimer un professionnel 
    app.delete('/delete/pro/:id', async (req, res, next)=>{
        let deletedPro = await professionalsModel.deleteProfessional(req.params.id)
        if(deletedPro.code){
            res.json({status:500, msg: "Problème lors de la suppression du professionnel"})
        } else {
            res.json({status:200, msg: "Professionnel supprimé", result: deletedPro})
        }
    })

    //route permettant de récupérer des professionnel par spécialisation
    app.get('/pro/category/:speciality_id', async (req, res, next)=>{
        let proByCategory = await professionalsModel.getProfessionnalBySpecialityId(req.params.speciality_id)
        if(proByCategory.code){
            res.json({status: 500, msg: "Problème lors de la récupération des professionnels"})
        } else {
            res.json({status:200, msg: "Professionnel récupéré", result: proByCategory})
        }
    })

    //route de récupération des spécialisations 
    app.get('/specializations', async (req, res, next)=>{
        let specializations = await professionalsModel.getAllSpecializations()
        if(specializations.code){
            res.json({status: 500, msg: "Problème lors de la récupération des spécialisations"})
        } else {
            res.json({status: 200, msg: "Spécialisation récupérées", result: specializations})
        }
    })
}
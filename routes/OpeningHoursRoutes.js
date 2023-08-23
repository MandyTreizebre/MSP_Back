module.exports = (app, db)=>{
    const openingHoursModel = require('../models/OpeningHoursModels')(db)

    //route permettant de récupérer tous les horaires 
    app.get('/opening-hours', async(req, res, next)=>{
        let allOpeningHours = await openingHoursModel.getAllOpeningHours()
        if(allOpeningHours.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires"})
        } else {
            res.json({status: 200, result: allOpeningHours})
        }
    })

    //route permettant de récupérer les horaires par professionnel
    app.get('/pro/opening-hours/:fk_pro_id', async (req, res, next)=>{
        let openingHoursByProfessionnal = await openingHoursModel.getOpeningHoursByProfessional(req.params.fk_pro_id)
        if(openingHoursByProfessionnal.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires du professionnel"})
        } else {
            res.json({status: 200, result: openingHoursByProfessionnal})
        }
    })

    //route permettant d'ajouter un horaire 
    app.post('/save/opening-hours', async (req, res, nest)=>{
        let addOpeningHours = await openingHoursModel.saveOpeningHours(req)
        if(addOpeningHours.code){
            res.json({status: 500, msg: "Problème lors de l'ajout des horaires"})
        }  else {
            res.json({status: 200, result: addOpeningHours})
        }
    })

    //route permettant de modifier des horaires 
    app.put('/update/opening-hours/:id', async (req, res, next)=>{
        let updatedOpeningHours = await openingHoursModel.updateOpeninghours(req, req.params.id)
        if(updatedOpeningHours.code){
            res.json({status: 500, msg: "Problème lors de la modification des horaires"})
            console.log(updatedOpeningHours.code)
        } else {
            res.json({status: 200, result: updatedOpeningHours})
        }
    })

    //route permettant de supprimer des horaires 
    app.delete('/delete/opening-hours/:id', async (req, res, next)=>{
        let deletedOpeningHours = await openingHoursModel.deleteOpeningHours(req.params.id)
        if(deletedOpeningHours.code){
            res.json({status: 500, msg: "Problème lors de la suppression des horaires"})
        } else {
            res.json({status: 200, result: deletedOpeningHours})
        }
    })
}
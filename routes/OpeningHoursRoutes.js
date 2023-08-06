module.exports = (app, db)=>{
    const openingHoursModel = require('../models/OpeningHoursModels')(db)

    //route permettant de récupérer tous les horaires 
    app.get('/all/hours', async(req, res, next)=>{
        let allHours = await openingHoursModel.getAllHours()
        if(allHours.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires"})
        } else {
            res.json({status: 200, result: allHours})
        }
    })

    //route permettant de récupérer les horaires par professionnel
    app.get('/pros/hours/:fk_pro_id', async (req, res, next)=>{
        let hoursByProfessionnal = await openingHoursModel.getHoursByProfessionnal(req.params.fk_pro_id)
        if(hoursByProfessionnal.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires du professionnel"})
        } else {
            res.json({status: 200, result: hoursByProfessionnal})
        }
    })

    //route permettant d'ajouter un horaire 
    app.post('/add/hours', async (req, res, nest)=>{
        let addHours = await openingHoursModel.addHours(req)
        if(addHours.code){
            res.json({status: 500, msg: "Problème lors de l'ajout des horaires"})
        }  else {
            res.json({status: 200, result: addHours})
        }
    })

    //route permettant de modifier des horaires 
    app.put('/update/hours/:id', async (req, res, next)=>{
        let updatedHours = await openingHoursModel.updateHours(req, req.params.id)
        if(updatedHours.code){
            res.json({status: 500, msg: "Problème lors de la modification des horaires"})
        } else {
            res.json({status: 200, result: updatedHours})
        }
    })

    //route permettant de supprimer des horaires 
    app.delete('/delete/hours/:id', async (req, res, next)=>{
        let deletedHours = await openingHoursModel.deleteHours(req.params.id)
        if(deletedHours.code){
            res.json({status: 500, msg: "Problème lors de la suppression des horaires"})
        } else {
            res.json({status: 200, result: deletedHours})
        }
    })
}
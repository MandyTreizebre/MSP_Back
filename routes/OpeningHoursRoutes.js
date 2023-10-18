const withAuth = require('../withAuth')

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
    app.get('/pro/opening-hours/:pro_id', async (req, res, next)=>{
        let openingHoursByProfessionnal = await openingHoursModel.getOpeningHoursByPro(req.params.pro_id)
        if(openingHoursByProfessionnal.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires du professionnel", openingHoursByProfessionnal})
        } else {
            res.json({status: 200, result: openingHoursByProfessionnal})
        }
    })

    //route permettant d'ajouter un horaire OK VERIF
    app.post('/save/opening-hours', withAuth, async (req, res, nest)=>{
        let pro_id = parseInt(req.body.pro_id, 10)
        if (!req.body.pro_id || isNaN(pro_id) || pro_id <= 0) {
            return res.status(400).json({ status: 400, msg: "Professionnel invalide" })
        }
        
        let day_id = parseInt(req.body.day_id, 10)
        if (!req.body.day_id || isNaN(day_id) || day_id <= 0) {
            return res.status(400).json({ status: 400, msg: "Jour invalide" })
        }
        
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    
        if (!req.body.h_start_morning || !timePattern.test(req.body.h_start_morning)) {
            return res.status(400).json({ status: 400, msg: "Heure de début du matin invalide" })
        }
    
        if (!req.body.h_end_morning || !timePattern.test(req.body.h_end_morning)) {
            return res.status(400).json({ status: 400, msg: "Heure de fin du matin invalide" })
        }
    
        if (!req.body.h_start_afternoon || !timePattern.test(req.body.h_start_afternoon)) {
            return res.status(400).json({ status: 400, msg: "Heure de début de l'après-midi invalide" })
        }
    
        if (!req.body.h_end_afternoon || !timePattern.test(req.body.h_end_afternoon)) {
            return res.status(400).json({ status: 400, msg: "Heure de fin de l'après-midi invalide" })
        }
    
        try {
            let saveOpeningHours = await openingHoursModel.addOpeningHours(req)
        
            if(saveOpeningHours.code){
                res.json({status: 500, msg: "Problème lors de l'ajout des horaires"})
            } else {
             res.json({status: 201, msg: "Horaires ajoutés", result: saveOpeningHours})
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout des horaires:", error)
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    //route permettant de modifier des horaires OK VERIF
    app.put('/edit/opening-hours/:pro_id', withAuth, async (req, res, next)=>{
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
        if (!req.body.h_start_morning || !timePattern.test(req.body.h_start_morning)) {
            return res.status(400).json({ status: 400, msg: "Heure de début du matin invalide" })
        }
    
        if (!req.body.h_end_morning || !timePattern.test(req.body.h_end_morning)) {
            return res.status(400).json({ status: 400, msg: "Heure de fin du matin invalide" })
        }
    
        if (!req.body.h_start_afternoon || !timePattern.test(req.body.h_start_afternoon)) {
            return res.status(400).json({ status: 400, msg: "Heure de début de l'après-midi invalide" })
        }
    
        if (!req.body.h_end_afternoon || !timePattern.test(req.body.h_end_afternoon)) {
            return res.status(400).json({ status: 400, msg: "Heure de fin de l'après-midi invalide" })
        }
        
        try {
            let updatedOpeningHours = await openingHoursModel.editProOpeningHours(req)
        
            if(updatedOpeningHours.code){
                res.json({status: 500, msg: "Problème lors de la modification des horaires"})
                console.log("ERREUR", updatedOpeningHours.code)
            } else {
                res.json({status: 200, msg: "Horaires modifiés", result: updatedOpeningHours})
            }
        } catch (error) {
            console.error("Erreur lors de la modification des horaires:", error)
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    /*//route permettant de supprimer des horaires 
    app.delete('/delete/opening-hours/:id', async (req, res, next)=>{
        let deletedOpeningHours = await openingHoursModel.deleteOpeningHours(req.params.id)
        if(deletedOpeningHours.code){
            res.json({status: 500, msg: "Problème lors de la suppression des horaires"})
        } else {
            res.json({status: 200, result: deletedOpeningHours})
        }
    })*/

    //essai 

    /*app.get('/pro/:speciality_id', async (req, res, next)=> {
        let pro = await openingHoursModel.displayProBySpe(req.params.speciality_id)
        if(pro.code){
            res.json({status: 500, msg: "Problème lors de la récupération des horaires"})
        } else {
            res.json({status: 200, result: pro})
        }
    })*/

    
    app.get('/jours', async (req, res, next)=> {
        let days = await openingHoursModel.getDays()
        if(days.code){
            res.json({status: 500, msg: "Problème lors de la récupération des jours"})
        } else {
            res.json({status: 200, result: days})
        }
    })
}
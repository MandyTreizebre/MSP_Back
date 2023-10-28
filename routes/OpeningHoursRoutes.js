/*Importing the authentication middleware*/
const withAuth = require('../withAuth')

module.exports = (app, db)=>{
    /*Import and initialize OpeningHoursModels with database connection*/
    const openingHoursModel = require('../models/OpeningHoursModels')(db)

     /*GET route to retrieve all opening hours*/
    app.get('/opening-hours', async(req, res, next)=>{
        /*Call the model's getAllOpeningHours method to retrieve opening hours*/
        let allOpeningHours = await openingHoursModel.getAllOpeningHours()
        /*Check whether an error has occurred during the database query*/
        if(allOpeningHours.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des horaires"})
        } else {
            /*Send response with 200 status and opening hours in case of success*/
            res.json({status: 200, result: allOpeningHours})
        }
    })

    /* Get route to retroeve the opening hours of a specific professional*/
    app.get('/pro/opening-hours/:pro_id', async (req, res, next)=>{
        /*Call the model's getAllOpeningHoursByPro method to retrieve opening hours for a pro by his is*/
        let openingHoursByProfessionnal = await openingHoursModel.getOpeningHoursByPro(req.params.pro_id)
        /*Check whether an error has occurred during the database query*/
        if(openingHoursByProfessionnal.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des horaires du professionnel", openingHoursByProfessionnal})
        } else {
             /*Send response with 200 status and opening hours by pro in case of success*/
            res.json({status: 200, result: openingHoursByProfessionnal})
        }
    })

    /*POST to add opening hours in the database */
    app.post('/save/opening-hours', withAuth, async (req, res, nest)=>{
        /*Validating input for saving the opening hours :*/
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
            /*Call the model's addOpeningHours method to add an information*/
            let saveOpeningHours = await openingHoursModel.addOpeningHours(req)
            /*Check whether an error has occurred during the database query*/
            if(saveOpeningHours.code){
                /*Send response with status 500 in case of error*/
                res.json({status: 500, msg: "Problème lors de l'ajout des horaires"})
            } else {
            /*Send response with 201 status and opening hours in case of success*/
             res.json({status: 201, msg: "Horaires ajoutés", result: saveOpeningHours})
            }
        } catch (error) {
            /*send a response with status 500 in case of an exception*/
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    /*PUT to modify an information*/
    app.put('/edit/opening-hours/:pro_id', withAuth, async (req, res, next)=>{
        /*Validating input for modify the opening hours :*/
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
            /*Call the model's updateProOpeningHours method to update an opening hours*/
            let updatedOpeningHours = await openingHoursModel.udpateProOpeningHours(req)
            /*Check whether an error has occurred during the database query*/
            if(updatedOpeningHours.code){
                /*Send response with status 500 in case of error*/
                res.json({status: 500, msg: "Problème lors de la modification des horaires"})
            } else {
                /*Send response with 200 status and updated opening hours in case of success*/
                res.json({status: 200, msg: "Horaires modifiés", result: updatedOpeningHours})
            }
        } catch (error) {
            /*send a response with status 500 in case of an exception*/
            res.status(500).json({ status: 500, msg: "Erreur de serveur interne" })
        }
    })

    /*Get route to retrieve all days*/
    app.get('/days', async (req, res, next)=> {
        /*Call the model's getDays method to retrieve idays*/
        let days = await openingHoursModel.getDays()
        /*Check whether an error has occurred during the database query*/
        if(days.code){
            /*Send response with status 500 in case of error*/
            res.json({status: 500, msg: "Problème lors de la récupération des jours"})
        } else {
             /*Send response with 200 status and days in case of success*/
            res.json({status: 200, result: days})
        }
    })
}
const withAuth = require('../middlewares/withAuth')

module.exports = (app, db)=>{
   
    const OpeningHoursDAL = require('../DAL/OpeningHoursDAL')(db)

    // Retrieve all opening hours
    app.get('/api/opening-hours', async(req, res, next)=>{
        
        let OpeningHours = await OpeningHoursDAL.getOpeningHours()
        
        if (OpeningHours.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des horaires" })
            return
        } 
            
        res.status(200).json({ msg: "Horaires récupérés", result: OpeningHours })
        return
    })

    // Retrieve the opening hours of a specific professional
    app.get('/api/pro/opening-hours/:pro_id/:day_id', async (req, res, next)=>{
        console.log("Request Params:", req.params)
        let openingHoursByProfessionnal = await OpeningHoursDAL.getOpeningHoursByProAndDay(req.params.pro_id, req.params.day_id)
        
        if (openingHoursByProfessionnal.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des horaires du professionnel" })
            return
        } 
            
        res.status(200).json({ msg: "Horaires du professionnel récupérés", result: openingHoursByProfessionnal })
        return

    })

    // Add opening hours in the database 
    app.post('/api/save/opening-hours', withAuth, async (req, res, nest)=>{
        const pro_id = parseInt(req.body.pro_id, 10)
        const day_id = parseInt(req.body.day_id, 10)

        const { h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon } = req.body

        if (!req.body.pro_id || isNaN(pro_id) || pro_id <= 0) {
            res.status(400).json({ msg: "Professionnel invalide" })
            return
        }
        
        if (!req.body.day_id || isNaN(day_id) || day_id <= 0) {
            res.status(400).json({ msg: "Jour invalide" })
            return
        }
        
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    
        if (!req.body.h_start_morning || !timePattern.test(req.body.h_start_morning)) {
            res.status(400).json({ msg: "Heure de début du matin invalide" })
            return
        }
    
        if (!req.body.h_end_morning || !timePattern.test(req.body.h_end_morning)) {
            res.status(400).json({ msg: "Heure de fin du matin invalide" })
            return
        }
    
        if (!req.body.h_start_afternoon || !timePattern.test(req.body.h_start_afternoon)) {
            res.status(400).json({ msg: "Heure de début de l'après-midi invalide" })
            return
        }
    
        if (!req.body.h_end_afternoon || !timePattern.test(req.body.h_end_afternoon)) {
            res.status(400).json({ msg: "Heure de fin de l'après-midi invalide" })
            return
        }

        const existingHours = await OpeningHoursDAL.getOpeningHoursByProAndDay(pro_id, day_id)

        if (existingHours.length > 0) {
            res.status(400).json({ msg: "Des horaires existent déjà pour ce jour et ce professionnel." })
            return
        }
    
        const data = { pro_id, day_id, h_start_morning, h_end_morning, h_start_afternoon, h_end_afternoon }
        const savedOpeningHours = await OpeningHoursDAL.addOpeningHours(data)

        if (savedOpeningHours.code) {
            console.log("savedOpeningHours.code", savedOpeningHours.code)
            res.status(500).json({ msg: "Erreur interne du serveur"})
            return
        } 

        // register professional
        res.status(201).json({ result: savedOpeningHours })
        return
    })

    // Modify an information
    app.put('/api/edit/opening-hours/:pro_id', withAuth, async (req, res, next)=>{

        const day_id = parseInt(req.body.day_id, 10)

        if (!req.body.day_id || isNaN(day_id) || day_id <= 0) {
            res.status(400).json({ msg: "Jour invalide" })
            return
        }

        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
        
        if (!req.body.h_start_morning || !timePattern.test(req.body.h_start_morning)) {
            res.status(400).json({ msg: "Heure de début du matin invalide" })
            return
        }
    
        if (!req.body.h_end_morning || !timePattern.test(req.body.h_end_morning)) {
            res.status(400).json({ msg: "Heure de fin du matin invalide" })
            return
        }
    
        if (!req.body.h_start_afternoon || !timePattern.test(req.body.h_start_afternoon)) {
            res.status(400).json({ msg: "Heure de début de l'après-midi invalide" })
            return
        }
    
        if (!req.body.h_end_afternoon || !timePattern.test(req.body.h_end_afternoon)) {
            res.status(400).json({ msg: "Heure de fin de l'après-midi invalide" })
            return
        }
        
        let updatedOpeningHours = await OpeningHoursDAL.udpateOpeningHours(req)
        
        if (updatedOpeningHours.code) {
            res.status(500).json({ msg: "Problème lors de la modification des horaires" })
            return
        } 
            
        res.status(200).json({ result: updatedOpeningHours })
        return
    })

    // Retrieve all days
    app.get('/api/days', async (req, res, next)=> {
        
        let days = await OpeningHoursDAL.getDays()

        if (days.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des jours"})
            return
        }
            
        res.status(200).json({ result: days})
        return
    })
}
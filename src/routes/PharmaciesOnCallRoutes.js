const withAuth = require('../middlewares/withAuth') 
const validator = require('validator') 

module.exports = (app, db) => {

    const PharmaciesOnCallDAL = require('../DAL/PharmaciesOnCallDAL')(db) 


    // Récupérer toutes les pharmacies
    app.get('/api/pharmacies-on-call', async (req, res, next) => {
        let pharmaciesOnCall = await PharmaciesOnCallDAL.getPharmaciesOnCall() 
    
        if (pharmaciesOnCall.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des pharmacies de garde" }) 
            return 
        }
    
        res.status(200).json({ msg: "Pharmacies de garde récupérées", result: pharmaciesOnCall }) 
        return 
    }) 

    // Récupérer les pharmacies de garde pour un jour donné
    app.get('/api/pharmacies-on-call-schedules', async (req, res, next) => {
        let pharmaciesOnCallSchedules = await PharmaciesOnCallDAL.getPharmaciesOnCallAndSchedules() 

        if (pharmaciesOnCallSchedules.code) {
            console.log("code dans la route de récupération des pharmacies de gardes et leurs horaires", pharmaciesOnCallSchedules.code )
            res.status(500).json({ msg: "Problème lors de la récupération des pharmacies de garde" }) 
            return 
        }

        res.status(200).json({ msg: "Pharmacies de garde récupérées", result: pharmaciesOnCallSchedules }) 
        return 
    }) 

    // Ajouter une nouvelle pharmacie de garde
    app.post('/api/save-pharmacies-on-call', withAuth, async (req, res, next) => {
        const name = validator.trim(req.body.name)
        const address = validator.trim(req.body.address)
        const phone = validator.trim(req.body.phone)

        // Vérification des données dans les champs par rapport aux regex
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,200}$/u.test(name)) {
            res.status(400).json({ msg: "Nom invalide" }) 
            return 
        }
        
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s'’`-]{1,200}$/u.test(address)) {
            res.status(400).json({ msg: "Adresse invalide" })
            return
        }
        
        if (!/^\d{1,10}$/.test(phone)) {
            res.status(400).json({ msg: "Téléphone invalide" })
            return
        }

        let addedPharmacies = await PharmaciesOnCallDAL.addPharmaciesOnCall(req) 

        // Vérifie les erreurs
        if (addedPharmacies.code) {
            res.status(500).json({ msg: "Problème lors de l'ajout de la pharmacie" }) 
            return 
        }

        res.status(201).json({ result: addedPharmacies }) 
        return 
    }) 

    // Ajouter les gardes pour une pharmacie
    app.post('/api/save-schedules-pharmacies-on-call', withAuth, async (req, res, next) => {
        const pharmacy_id = parseInt(req.body.pharmacy_id, 10) 

        if (!req.body.pharmacy_id || isNaN(pharmacy_id) || pharmacy_id <= 0) {
            res.status(400).json({ msg: "Pharmacie invalide" }) 
            return 
        }

        let addedSchedules = await PharmaciesOnCallDAL.addSchedulesForPharmaciesOnCall(req) 

        // Vérifie les erreurs
        if (addedSchedules.code) {
            console.log(".code dans la route =>", addedSchedules.code)
            res.status(500).json({ msg: "Problème lors de l'ajout de la garde" }) 
            return 
        }

        res.status(201).json({ result: addedSchedules }) 
        return 
    }) 
}

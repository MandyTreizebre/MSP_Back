const withAuth = require('../middlewares/withAuth')
const validator = require('validator')

module.exports = (app,db)=>{

    const professionalsDAL = require('../DAL/ProfessionalsDAL')(db)
    
    // Obtenir les professionnels et leurs horaires 
    app.get('/api/professionals-and-hours', async (req, res, next) => {

    	let prosAndHours = await professionalsDAL.getProfessionalsAndHours()

        if (prosAndHours.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des professionnels et de leurs horaires" })
            return
        }  
    	
        res.status(200).json({ msg: "Récupération des professionnels et de leurs horaires ok", result: prosAndHours }) 
        return
    })

    // Obtenir tous les professionnels 
    app.get('/api/professionals', async (req, res, next) => {
       
    	let pros = await professionalsDAL.getProfessionals()
       
    	if (pros.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des professionnels" })
            return
        }

    	res.status(200).json({ msg: "Professionnels récupérés avec succès", result: pros })
        return
    })

    // Obtenir un professionnel par son id 
    app.get('/api/professional/:id', async (req, res, next)=>{
       
        let prosById = await professionalsDAL.GetProfessionalById(req.params.id)
        
        // Vérifie si l'id existe 
        if (prosById.length === 0) {
            res.status(204).json({ msg: "Il n'y a pas de professionnel correspondant à cet ID" })
            return
        } else {
            if (prosById.code) {
                res.status(500).json({ msg: "Problème lors de la récupération de ce professionnel" })
                return
            } 
                
            res.status(200).json({ result: prosById })
            return        
        }
    })

    // Ajouter un professionnel 
    app.post('/api/save/pro', withAuth, async (req, res, next)=>{

        // Input cleaning
        const lastname = validator.trim(req.body.lastname)
        const firstname = validator.trim(req.body.firstname)
        const address = validator.trim(req.body.address)
        const zip = validator.trim(req.body.zip)
        const city = validator.trim(req.body.city)
        const phone = validator.trim(req.body.phone)
        const details = validator.trim(req.body.details)

        // Vérifie si les données correspondent aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,100}$/u.test(lastname)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }
        

        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,50}$/u.test(firstname)) {
            res.status(400).json({ msg: "Prénom invalide" })
            return
        }

        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s'’`-]{1,50}$/u.test(address)) {
            res.status(400).json({ msg: "Adresse invalide" })
            return
        }
        
        if (!/^\d{1,5}$/.test(zip)) {
            res.status(400).json({ msg: "Code postal invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-\'’‘éàèùâêîôûäëïöüçñ]{1,50}$/.test(city)) {
            res.status(400).json({ msg: "Ville invalide" })
            return
        }

        if (!/^\d{1,10}$/.test(phone)) {
            res.status(400).json({ msg: "Téléphone invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-\/:'éàèùâêîôûäëïöüçñ’\.]{1,100}$/.test(details)) {
            res.status(400).json({ msg: "Détails invalides" })
            return
        }
        
        let addedPro = await professionalsDAL.addProfessional(req)

        if (addedPro.code) {
            res.status(500).json({ msg: "Erreur interne du serveur"})
            return
        }
           
        res.status(201).json({ msg: "Professionnel créé", result: addedPro })
        return
    })

    // Modifier un professionnel 
    app.put('/api/edit/pro/:id', withAuth, async (req, res, next)=>{

        const lastname = validator.trim(req.body.lastname)
        const firstname = validator.trim(req.body.firstname)
        const address = validator.trim(req.body.address)
        const zip = validator.trim(req.body.zip)
        const city = validator.trim(req.body.city)
        const phone = validator.trim(req.body.phone)
        const details = validator.trim(req.body.details)

        // Vérifie si les données correspondent aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,100}$/u.test(lastname)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }

        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,50}$/u.test(firstname)) {
            res.status(400).json({ msg: "Prénom invalide" })
            return
        }

        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s'’`-]{1,50}$/u.test(address)) {
            res.status(400).json({ msg: "Adresse invalide" })
            return
        }

        if (!/^\d{1,5}$/.test(zip)) {
            res.status(400).json({ msg: "Code postal invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-\'’‘éàèùâêîôûäëïöüçñ]{1,50}$/.test(city)) {
            res.status(400).json({ msg: "Ville invalide" })
            return
        }

        if (!/^\d{1,10}$/.test(phone)) {
            res.status(400).json({ msg: "Téléphone invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-\/:'éàèùâêîôûäëïöüçñ’\.]{1,100}$/.test(details)) {
            res.status(400).json({ msg: "Détails invalides" })
            return
        }

        let updatedPro = await professionalsDAL.updateProfessional(req, req.params.id)
            
        if (updatedPro.code) {
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return
        } 
            
        res.json({ status: 200, msg: "Professionnel modifié", result: updatedPro })
        return
    })

    // Modifier le statut d'un professionnel 
    app.put('/api/status/pro/:id', withAuth, async (req, res, next)=>{
        
        let statusChanged = await professionalsDAL.changeStatusProfessional(req.params.id)

        if (statusChanged.code) {
            res.status(500).json({ msg: "Problème lors de la désactivation du professionnel" })
            return
        }
            
        res.status(200).json({ msg: "Changement du status du professionnel", result: statusChanged })
        return
    })

    // Obtenir les professionnels par leur spécialisations 
    app.get('/api/pro/:speciality_id', async (req, res, next)=> {
        const specialityId = parseInt(req.params.speciality_id)

        if (isNaN(specialityId)) {
            res.status(404).json({ msg: "Page non trouvée" })
            return
        }

        let pro = await professionalsDAL.getProBySpe(req.params.speciality_id)
        
        if (pro.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des professionnels" })
            return
        }
            
        res.status(200).json({ msg: "Professionnels récupérés", result: pro })
        return
    })

    // Obtenir toutes les spécialisations 
    app.get('/api/specializations', async (req, res, next)=>{
    
        let specializations = await professionalsDAL.getSpecializations()
            
        if (specializations.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des spécialisations" })
            return
        } 
            
        res.status(200).json({ msg: "Spécialisation récupérées", result: specializations })
        return
    })

    // Obtenir les professionnels de gardes 
    app.get('/api/professionals-guards', async (req, res, next)=> {

        let pros = await professionalsDAL.getProfessionalsGuards()
    
        if (pros.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des professionnels de gardes" })
            return
        }
            
        res.status(200).json({ msg: "Professionnels de gardes récupérées", result: pros })
        return
    })
}
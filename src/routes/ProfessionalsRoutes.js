const withAuth = require('../middlewares/withAuth')
const { escape } = require('validator')

module.exports = (app,db)=>{

    const professionalsDAL = require('../DAL/ProfessionalsDAL')(db)
    
    //Retrieve all professionals and their opening hours
    app.get('/api/professionals-and-hours', async (req, res, next) => {

    	let prosAndHours = await professionalsDAL.getProfessionalsAndHours()

        if (prosAndHours.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des professionnels et de leurs horaires" })
            return
        }  
    	
        res.status(200).json({ msg: "Récupération des professionnels et de leurs horaires ok", result: prosAndHours }) 
        return
    })

    //Retrieve all professionals
    app.get('/api/professionals', async (req, res, next) => {
       
    	let pros = await professionalsDAL.getProfessionals()
       
    	if (pros.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des professionnels" })
            return
        }

    	res.status(200).json({ msg: "Professionnels récupérés avec succès", result: pros })
        return
    })

    //Retrieve professional by his ID
    app.get('/api/professional/:id', async (req, res, next)=>{
       
        let prosById = await professionalsDAL.GetProfessionalById(req.params.id)
        
        //Check if the ID exists
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

    // POST to add a professional in the database 
    app.post('/api/save/pro', withAuth, async (req, res, next)=>{

        // Input cleaning
        const lastname = escape(req.body.lastname).trim()
        const firstname = escape(req.body.firstname).trim()
        const address = escape(req.body.address).trim()
        const zip = escape(req.body.zip).trim()
        const city = req.body.city
        const phone = escape(req.body.phone).trim()
        const details = req.body.details

        // Checks if data in input matches the regex
        if (!/^[a-zA-ZÀ-ÿ\s-]{1,100}$/.test(lastname)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }

        if (!/^[a-zA-ZÀ-ÿ\s-]{1,50}$/.test(firstname)) {
            res.status(400).json({ msg: "Prénom invalide" })
            return
        }

        if (!!/^[a-zA-Z0-9 \-'éàèùâêîôûäëïöüçñÎ]{1,50}$/.test(address)) {
            res.status(400).json({ msg: "Addresse invalide" })
            return
        }

        if (!/^\d{1,5}$/.test(zip)) {
            res.status(400).json({ msg: "Code postal invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-\'’‘éàèùâêîôûäëïöüçñ]{1,50}$/.test(city)) {
            res.status(400).json({ msg: "Ville invalide" });
            return;
        }

        if (!/^\d{1,10}$/.test(phone)) {
            res.status(400).json({ msg: "Téléphone invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-'éàèùâêîôûäëïöüçñ’]{1,100}$/.test(details)) {
            res.status(400).json({ msg: "Détails invalides" })
            return
        }

        let addedPro = await professionalsDAL.addProfessional(req)

        // checks for errors
        if (addedPro.code) {
            res.status(500).json({ msg: "Erreur interne du serveur"})
            return
        }
           
        // register professional
        res.status(201).json({ msg: "Professionnel créé", result: addedPro })
        return
    })

    /*PUT to modify a professional*/
    app.put('/api/edit/pro/:id', withAuth, async (req, res, next)=>{

        // Input cleaning
        const lastname = escape(req.body.lastname).trim()
        const firstname = escape(req.body.firstname).trim()
        const address = escape(req.body.address).trim()
        const zip = escape(req.body.zip).trim()
        const city = req.body.city
        const phone = escape(req.body.phone).trim()
        const details = req.body.details

        // Checks if data in input matches the regex
        if (!/^[a-zA-ZÀ-ÿ\s-]{1,100}$/.test(lastname)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }

        if (!/^[a-zA-ZÀ-ÿ\s-]{1,50}$/.test(firstname)) {
            res.status(400).json({ msg: "Prénom invalide" })
            return
        }

        if (!!/^[a-zA-Z0-9 \-'éàèùâêîôûäëïöüçñÎ]{1,50}$/.test(address)) {
            res.status(400).json({ msg: "Addresse invalide" })
            return
        }

        if (!/^\d{1,5}$/.test(zip)) {
            res.status(400).json({ msg: "Code postal invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-'’éàèùâêîôûäëïöüçñ]{1,50}$/.test(city)) {
            res.status(400).json({ msg: "Ville invalide" })
            return;
        }

        if (!/^\d{1,10}$/.test(phone)) {
            res.status(400).json({ msg: "Téléphone invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 \-'éàèùâêîôûäëïöüçñ’]{1,100}$/.test(details)) {
            res.status(400).json({ msg: "Détails invalides" })
            return
        }

        let updatedPro = await professionalsDAL.updateProfessional(req, req.params.id)
            
        // checks for errors
        if (updatedPro.code) {
            console.log("code dans le professional routes =>", updatedPro.code)
            res.status(500).json({ msg: "Erreur interne du serveur" })
            return
        } 
            
        // save updates
        res.json({ status: 200, msg: "Professionnel modifié", result: updatedPro })
        return
    })

    // Update the status of a professional (isActive or not)
    app.put('/api/status/pro/:id', withAuth, async (req, res, next)=>{
        
        let statusChanged = await professionalsDAL.changeStatusProfessional(req.params.id)

        if (statusChanged.code) {
            res.status(500).json({ msg: "Problème lors de la désactivation du professionnel" })
            return
        }
            
        res.status(200).json({ msg: "Changement du status du professionnel", result: statusChanged })
        return
    })

    // Retrieve professionals by their specializations
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

    // Retrieve all specializations
    app.get('/api/specializations', async (req, res, next)=>{
    
        let specializations = await professionalsDAL.getSpecializations()
            
        if (specializations.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des spécialisations" })
            return
        } 
            
        res.status(200).json({ msg: "Spécialisation récupérées", result: specializations })
        return
    })

    // Retrieve professionals who are on guard
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
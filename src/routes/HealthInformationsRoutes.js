const withAuth = require('../middlewares/withAuth')
const multerErrorHandler = require('../middlewares/multerErrorHandler')
const validator = require('validator')

module.exports = (app,db)=>{

    const HealthInformationsDAL = require('../DAL/HealthInformationsDAL')(db)
    
    // Obtenir toutes les informations
    app.get('/api/informations', async (req, res, next) => {

    	let infos = await HealthInformationsDAL.getInformations()

    	if (infos.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des informations" })
            return
        }
    		
        res.status(200).json({ msg: "Informations récupérées", result: infos })
        return
    })

    // Obtenir une information par l'id 
    app.get('/api/information/:id', async (req, res, next) => {
        let informationById = await HealthInformationsDAL.getOneInformationById(req.params.id)
        
        // Vérifie si l'id existe 
        if (informationById.length === 0) {
            res.status(204).json({ msg: "Il n'y a pas d'information correspondant à cet id" })
            return
        } else {
            if (informationById.code) {
                res.status(500).json({ msg: "Problème lors de la récupération des informations" })
                return
            } 

            res.status(200).json({ result: informationById })
            return
        }
    })
    
    // Obtenir les informations par catégorie 
    app.get('/api/informations/:category', async (req, res, next)=> {
       
        let infosByCategory = await HealthInformationsDAL.getInformationsByCategory(req.params.category)

        if (infosByCategory.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des informations" })
            return
        }
    		
        res.status(200).json({ msg: "Informations par catégories récupérées avec succès", result: infosByCategory })
        return
    })

    // Obtenir les catégories
    app.get('/api/categories', async (req, res, next)=> {

        let categories = await HealthInformationsDAL.getCategories()

        if (categories.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des catégories" })
            return
        }
    		
        res.status(200).json({ msg: "Catégories récupérées", result: categories })
        return
    })

    // Ajouter une information
    app.post('/api/save-information', withAuth, multerErrorHandler, async(req, res, next)=>{

        const title = validator.trim(req.body.title)
        const description = validator.trim(req.body.description)
        const link = validator.trim(req.body.link)

        // Vérification des données par rapport aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,100}$/u.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[\p{L}0-9 .,'-]{1,500}$/u.test(description)) {
            res.status(400).json({ msg: "Description invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let addedInformation = await HealthInformationsDAL.addInformation(req)

        // Vérif des erreurs 
        if (addedInformation.code) {
            res.status(500).json({ msg: "Problème lors de la création de l'information" })
            return
        } 
    		
        res.status(201).json({ result: addedInformation })
        return

    })

    // Modifier une information 
    app.put('/api/update-information/:id',withAuth, multerErrorHandler, async (req, res, next)=>{
       
        const title = validator.trim(req.body.title)
        const description = validator.trim(req.body.description)
        const link = validator.trim(req.body.link)

        // Vérification des données par rapport aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,100}$/u.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[\p{L}0-9 .,'-]{1,500}$/u.test(description)) {
            res.status(400).json({ msg: "Description invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let editedInformation = await HealthInformationsDAL.updateInformation(req, req.params.id)
        
        // Vérif des erreurs 
        if (editedInformation.code) {
            res.status(500).json({ msg: "Problème lors de la modification de l'information" })
            return
        } 
            
        res.status(200).json({ msg: "Information modifiée", result: editedInformation })
        return
    })

    // Supprimer une information 
    app.delete('/api/delete-information/:id', withAuth,  async (req, res, next)=>{
    
        let deletedInformation = await HealthInformationsDAL.deleteInformation(req.params.id)
        
        if (deletedInformation.code) {
            res.status(500).json({ msg: "Problème lors de la suppresion de l'information" })
            return
        } 
            
        res.status(200).json({ msg: "Information supprimée", result: deletedInformation })
        return
    })
}

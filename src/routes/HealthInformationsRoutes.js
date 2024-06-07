const withAuth = require('../middlewares/withAuth')
const multerErrorHandler = require('../middlewares/multerErrorHandler')
const { escape } = require('validator')

module.exports = (app,db)=>{

    const HealthInformationsDAL = require('../DAL/HealthInformationsDAL')(db)
    
    // Retrieve all informations
    app.get('/api/informations', async (req, res, next) => {

    	let infos = await HealthInformationsDAL.getInformations()

    	if (infos.code) {
    		res.status(500).json({ msg: "Problème lors de la récupération des informations" })
            return
        }
    		
        res.status(200).json({ msg: "Informations récupérées", result: infos })
        return
    })

    //Retrieve Information By Id 
    app.get('/api/information/:id', async (req, res, next) => {
        console.log("Request Params:", req.params)
        let informationById = await HealthInformationsDAL.getOneInformationById(req.params.id)
        console.log("ID reçu dans le DAL :", req.params.id)
        
        //Check if the ID exists 
        if ( informationById.length === 0 ) {
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
    
    // Retrieve informations by category
    app.get('/api/informations/:category', async (req, res, next)=> {
       
        let infosByCategory = await HealthInformationsDAL.getInformationsByCategory(req.params.category)

        if (infosByCategory.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des informations" })
            return
        }
    		
        res.status(200).json({ msg: "Informations par catégories récupérées avec succès", result: infosByCategory })
        return
    })

    // Retrieve categories
    app.get('/api/categories', async (req, res, next)=> {

        let categories = await HealthInformationsDAL.getCategories()

        if (categories.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des catégories" })
            return
        }
    		
        res.status(200).json({ msg: "Catégories récupérées", result: categories })
        return
    })

    // Add an information
    app.post('/api/save-information', withAuth, multerErrorHandler, async(req, res, next)=>{

        //Input cleaning 
        const title = escape(req.body.title).trim()
        const description = escape(req.body.description).trim()
        const link = req.body.link

        if (!/^[\p{L}0-9 .,'-]{1,100}$/u.test(title)) {
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

        // checks for errors
        if (addedInformation.code) {
            console.log("added information code", addedInformation.code)
            res.status(500).json({ msg: "Problème lors de la création de l'information" })
            return
        } 
    		
        res.status(201).json({ result: addedInformation })
        return

    })

    // Modify an information
    app.put('/api/update-information/:id',withAuth, multerErrorHandler, async (req, res, next)=>{
       
        //Input cleaning
        const title = escape(req.body.title).trim() 
        const description = escape(req.body.description).trim() 
        const link = req.body.link

        if (!/^[\p{L}0-9 .,'-]{1,100}$/u.test(title)) {
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
        
        // checks for errors
        if (editedInformation.code) {
            res.status(500).json({ msg: "Problème lors de la modification de l'information" })
            return
        } 
            
        res.status(200).json({ msg: "Information modifiée", result: editedInformation })
        return
    })

    // DELETE an information
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

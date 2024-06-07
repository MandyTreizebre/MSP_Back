const withAuth = require('../middlewares/withAuth')
const multerErrorHandler = require('../middlewares/multerErrorHandler')
const { escape } = require('validator')

module.exports = (app, db)=>{

    const ExternalProfessionalsDAL = require('../DAL/ExternalProfessionalsDAL')(db)

    //Retrieve all external professionals
    app.get('/api/external-professionals', async(req, res, next)=>{

        let allExternalPros = await ExternalProfessionalsDAL.getExternalPros()

        if (allExternalPros.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des professionnels externes" })
            return
        } 

        res.status(200).json({ msg: "Professionnels récupérés", result: allExternalPros })
        return
    })

    //Retrieve all external professional by his ID
    app.get('/api/external-professional/:id', async (req, res, next)=>{
        
        let externalProById = await ExternalProfessionalsDAL.getExternalProById(req.params.id)

        //Check if the ID exists            
        if (externalProById.length === 0) {
            res.status(204).json({ msg: "Il n'y a pas de professionnel correspondant à cet id" })
            return
        } else {
            if (externalProById.code) {
                res.status(500).json({ msg: "Problème lors de la récupération des professionnels externes" })
                return
            } 

            res.status(200).json({ msg: "Professionnel récupéré", result: externalProById })
            return
        }
    })

    // Add an external professional
    app.post('/api/save-external-professional', withAuth, multerErrorHandler, async(req, res, next)=>{
        
        //Input cleaning 
        const name = escape(req.body.name).trim()
        const link = req.body.link

        // Checks if data in input matches the regex
        if (!/^[\p{L}0-9 .,'-]{1,50}$/u.test(name)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }
        
        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let addedExternalPros = await ExternalProfessionalsDAL.addExternalPro(req)
        
        // checks for errors
        if (addedExternalPros.code) {
            res.status(500).json({ msg: "Problème lors de l'ajout du professionnel" })
            return
        } 
            
        res.status(201).json({ result: addedExternalPros })
        return
    })

    // Modify an external professional
    app.put('/api/update/external-pro/:id', withAuth, multerErrorHandler, async (req, res, next)=>{
        
        //Input cleaning 
        const name = escape(req.body.name).trim()
        const link = req.body.link
       
        // Checks if data in input matches the regex
        if (!/^[\p{L}0-9 .,'-]{1,50}$/u.test(name)) {
            res.status(400).json({ msg: "Nom invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }
       
        let updatedExternalPro = await ExternalProfessionalsDAL.updateExternalPro(req, req.params.id)

        // checks for errors
        if (updatedExternalPro.code) {
            res.status(500).json({ msg: "Problème lors de la modification du professionnel" })
            return
        }

        res.status(200).json({ msg: "Professionnel modifié", result: updatedExternalPro })
        return
    })

    // Delete an external professional
    app.delete('/api/delete/external-pro/:id', withAuth, async (req, res, next)=>{
        
        let deletedExternalPro = await ExternalProfessionalsDAL.deleteExternalPro(req.params.id)

        // checks for errors
        if (deletedExternalPro.code) {
            res.status(500).json({ msg: "Problème lors de la suppression du professionnel" })
            return
        } 

        res.status(200).json({ msg: "Professionnel supprimé", result: deletedExternalPro })
        return
    })
}
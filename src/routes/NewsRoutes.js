const withAuth = require('../middlewares/withAuth')
const multerErrorHandler = require('../middlewares/multerErrorHandler')
const validator = require('validator')

module.exports = (app, db)=>{
    const NewsDAL = require('../DAL/NewsDAL')(db)

    // Obtenir toutes les actualités 
    app.get('/api/news', async(req, res, next)=>{
 
        let news = await NewsDAL.getNews()

        if (news.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des actualités" })
            return
        } 
            
        res.status(200).json({ msg: "Actualités récupérées", result: news })
        return
    })

    // Obtenir lune actualité par id 
    app.get('/api/new/:id', async (req, res, next)=>{
        let newById = await NewsDAL.getNewById(req.params.id)

        if (newById.length === 0) {
            res.status(204).json({ msg: "Il n'y a pas d'actualités' correspondant à cet id" })
            return
        } else {
            if (newById.code) {
                res.status(500).json({ msg: "Problème lors de la récupération des actualités" })
                return
            } 

            res.status(200).json({ msg: "Actualité récupérée", result: newById })
            return
        }
    })

    // Ajouter une actualité 
    app.post('/api/save-new', withAuth, multerErrorHandler, async(req, res, next)=>{

        const title = validator.trim(req.body.title)
        const details = validator.trim(req.body.details)
        const external_link = validator.trim(req.body.external_link)

        // Vérification des données par rapport aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,50}$/.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[\p{L}0-9 .,'-]{1,200}$/u.test(details)) {
            res.status(400).json({ msg: "Détails invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(external_link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let addedNew = await NewsDAL.addNew(req)

        // Vérif des erreurs 
        if (addedNew.code) {
            res.status(500).json({ msg: "Problème lors de l'ajout de l'actualité" })
            return
        }
    		
        res.status(201).json({ msg: "Actualité enregistrée" , result: addedNew })
        return
    })

    // Modifier une actualité
    app.put('/api/update-new/:id', withAuth, multerErrorHandler, async (req, res, next)=>{

        const title = validator.trim(req.body.title)
        const details = validator.trim(req.body.details)
        const external_link = validator.trim(req.body.external_link)

        // Vérification des données par rapport aux regex 
        if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’`-]{1,50}$/.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[\p{L}0-9 .,'-]{1,200}$/u.test(details)) {
            res.status(400).json({ msg: "Détails invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(external_link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let editedNew = await NewsDAL.updateNew(req, req.params.id)

        if (editedNew.code) {
            res.status(500).json({ msg: "Problème lors de la modification de l'actualité" })
            return
        } 
            
        res.status(200).json({ msg: "Actualité modifiée", result: editedNew })
        return
    })

    // Supprimer une actualité
    app.delete('/api/delete-new/:id', withAuth,  async (req, res, next)=>{

        let deletedNew = await NewsDAL.deleteNew(req.params.id)

        // Vérif des erreurs 
        if (deletedNew.code) {
            res.status(500).json({ msg: "Problème lors de la suppresion de l'actualité" })
            return
        } 
            
        res.status(200).json({ msg: "Actualité supprimée", result: deletedNew })
        return
    })
}
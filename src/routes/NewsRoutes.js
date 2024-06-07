const withAuth = require('../middlewares/withAuth')
const multerErrorHandler = require('../middlewares/multerErrorHandler')
const { escape } = require('validator')

module.exports = (app, db)=>{
    const NewsDAL = require('../DAL/NewsDAL')(db)

    // Retrieve all news*/
    app.get('/api/news', async(req, res, next)=>{
 
        let news = await NewsDAL.getNews()

        if (news.code) {
            res.status(500).json({ msg: "Problème lors de la récupération des actualités" })
            return
        } 
            
        res.status(200).json({ msg: "Actualités récupérées", result: news })
        return
    })

    //Retrieve a new by his id 
    app.get('/api/new/:id', async (req, res, next)=>{
        let newById = await NewsDAL.getNewById(req.params.id)
        console.log(req.params.id)

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

    // Add a new
    app.post('/api/save-new', withAuth, multerErrorHandler, async(req, res, next)=>{

        //Input cleaning 
        const title = escape(req.body.title).trim()
        const details = escape(req.body.details).trim()
        const external_link = req.body.external_link

        if (!/^[a-zA-Z0-9 .,'-]{1,50}$/.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 .,'-]{1,200}$/.test(details)) {
            res.status(400).json({ msg: "Description invalide" })
            return
        }

        if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]*)*\/?$/.test(external_link)) {
            res.status(400).json({ msg: "Lien invalide" })
            return
        }

        let addedNew = await NewsDAL.addNew(req)

        // checks for errors
        if (addedNew.code) {
            res.status(500).json({ msg: "Problème lors de l'ajout de l'actualité" })
            return
        }
    		
        res.status(201).json({ msg: "Actualité enregistrée" , result: addedNew })
        return
    })

    // Modify a new
    app.put('/api/update-new/:id', withAuth, multerErrorHandler, async (req, res, next)=>{

        //Input cleaning 
        const title = escape(req.body.title).trim()
        const details = escape(req.body.details).trim()
        const external_link = req.body.external_link

        if (!/^[a-zA-Z0-9 .,'-]{1,50}$/.test(title)) {
            res.status(400).json({ msg: "Titre invalide" })
            return
        }

        if (!/^[a-zA-Z0-9 .,'-]{1,200}$/.test(details)) {
            res.status(400).json({ msg: "Description invalide" })
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

    // Delete a new
    app.delete('/api/delete-new/:id', withAuth,  async (req, res, next)=>{

        let deletedNew = await NewsDAL.deleteNew(req.params.id)

        // checks for errors
        if (deletedNew.code) {
            res.status(500).json({ msg: "Problème lors de la suppresion de l'actualité" })
            return
        } 
            
        res.status(200).json({ msg: "Actualité supprimée", result: deletedNew })
        return
    })
}
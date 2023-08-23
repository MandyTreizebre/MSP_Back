module.exports = (app, db)=>{
    const externalProfessionalsModel = require('../models/ExternalProfessionalsModel')(db)

//route permettant de récupérer tous autres pros
app.get('/external-professionals', async(req, res, next)=>{
    let allExternalPros = await externalProfessionalsModel.getExternalPros()
    if(allExternalPros.code){
        res.json({status: 500, msg: "Problème lors de la récupération des professionnels externes"})
    } else {
        res.json({status: 200, result: allExternalPros})
    }
})

//route permettant d'ajouter un autre pro
app.post('/save-external-professional', async(req, res, next)=>{
    let addExternalPros = await externalProfessionalsModel.addExternalPro(req)
    if(addExternalPros.code){
        res.json({status: 500, msg: "Problème lors de l'ajout du professionnel"})
    } else {
        res.json({status: 200, result: addExternalPros})
    }
})

//route permettant de modifier un pro 
app.put('/update/external-pro/:id', async (req, res, next)=>{
    let updatedPros = await externalProfessionalsModel.updateExternalPro(req, req.params.id)
    if(updatedPros.code){
        res.json({status: 500, msg: "Problème lors de la modification du professionnel"})
        console.log(updatedPros.code)
    } else {
        res.json({status: 200, result: updatedPros})
    }
})

//route permettant de supprimer des horaires 
app.delete('/delete/external-pro/:id', async (req, res, next)=>{
    let deletedPros = await externalProfessionalsModel.deleteExternalPro(req.params.id)
    if(deletedPros.code){
        res.json({status: 500, msg: "Problème lors de la suppression du professionnel"})
    } else {
        res.json({status: 200, result: deletedPros})
    }
})

}
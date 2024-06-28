module.exports = (_db) => {
    db = _db 
    return PharmaciesOnCallDAL 
} 

class PharmaciesOnCallDAL {
    // Obtenir toutes les pharmacies de gardes
    static getPharmaciesOnCall() {
        return db.query('SELECT pharmacies.id, pharmacies.name, pharmacies.address, pharmacies.phone FROM pharmacies')
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err 
            }) 
        }

    // Obtenir les pharmacies de garde pour un jour donné
    static getPharmaciesOnCallAndSchedules() {
        return db.query('SELECT pharmacies.id, pharmacies.name, pharmacies.address, pharmacies.phone, pharmacies_schedules.date, pharmacies_schedules.start_time, pharmacies_schedules.end_time FROM pharmacies INNER JOIN pharmacies_schedules ON pharmacies.id = pharmacies_schedules.pharmacy_id WHERE pharmacies_schedules.date = CURRENT_DATE')
            .then((res) => {
                return res 
            })
            .catch((err) => {
                return err 
            }) 
    }

    // Ajouter une nouvelle pharmacie
    static addPharmaciesOnCall(req) {
        return db.query('INSERT INTO pharmacies (name, address, phone) VALUES (?, ?, ?)', [req.body.name, req.body.address, req.body.phone])
            .then((res) => {
                return res 
            })
            .catch((err) => {
                return err 
            }) 
    }

    // Ajouter les dates et horaires des pharmacies de gardes
    static addSchedulesForPharmaciesOnCall(req) {
        return db.query('INSERT INTO pharmacies_schedules (pharmacy_id, date, start_time, end_time) VALUES (?, ?, ?, ?)', [req.body.pharmacy_id, req.body.date, req.body.start_time, req.body.end_time])
            .then((res) => {
                return res 
            })
            .catch((err) => {
                return err 
            }) 
    }
}

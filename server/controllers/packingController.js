module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing.packing_read([id])
			.then(list => res.status(200).send(list))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}
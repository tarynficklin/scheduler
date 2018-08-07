module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedule_read([id])
			.then(schedule => res.status(200).send(schedule))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}

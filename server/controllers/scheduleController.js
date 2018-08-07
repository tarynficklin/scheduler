module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.schedule_read([id])
			.then(schedule => res.status(200).send(schedule))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	readItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.schedule_item_read([id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	checkItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;
		const {checked} = req.body

		db.schedules.schedule_item_check([checked, id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}

module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.schedule_read([id])
			.then(schedule => res.status(200).send(schedule))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	create: (req, res) => {
		const db = req.app.get('db');
		const {trip_id, schedule_date} = req.body;

		db.schedules.schedule_create([trip_id, schedule_date])
			.then(schedule => res.status(200).send(schedule[0]))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	find: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.schedule_find([id])
			.then(schedule => res.status(200).send(schedule))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	readItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.item_read([id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	createItem: (req, res) => {
		const db = req.app.get('db');
		const {schedule_id, item_title, item_price, item_time} = req.body;

		db.schedules.item_create([schedule_id, item_title, item_price, item_time])
			.then(trip => res.status(200).send(trip[0]))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	titleItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;
		const {title} = req.body

		db.schedules.item_title([title, id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	priceItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;
		const {price} = req.body

		db.schedules.item_price([price, id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	checkItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;
		const {checked} = req.body

		db.schedules.item_check([checked, id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	deleteItem: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.schedules.item_delete([id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}

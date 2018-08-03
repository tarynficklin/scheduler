module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');

		db.trip_read()
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	find: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.trip_find([id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	create: (req, res) => {
		const db = req.app.get('db');
		const {trip_location, trip_start_date, trip_end_date, trip_budget, trip_packing_list, trip_schedule} = req.body;

		db.trip_create([trip_location, trip_start_date, trip_end_date, trip_budget, trip_packing_list, trip_schedule])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	update: (req, res) => {
		const db = req.app.get('db');
		const {trip_location, trip_start_date, trip_end_date, trip_budget, trip_packing_list, trip_schedule} = req.body;
		const {id} = req.params;

		db.trip_update([trip_location, trip_start_date, trip_end_date, trip_budget, trip_packing_list, trip_schedule, id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	delete: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.trip_delete([id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}
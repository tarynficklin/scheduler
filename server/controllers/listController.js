module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing_lists.list_read([id])
			.then(list => res.status(200).send(list))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	readLast: (req, res) => {
		const db = req.app.get('db');

		db.packing_lists.list_read_last()
			.then(list => res.status(200).send(list[0]))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	create: (req, res) => {
		const db = req.app.get('db');
		const {trip_id, packing_title} = req.body;

		db.packing_lists.list_create([trip_id, packing_title])
			.then(trip => res.status(200).send(trip[0]))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	check: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;
		const {checked} = req.body

		db.packing_lists.list_check([checked, id])
			.then(item => res.status(200).send(item))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	update: (req, res) => {
		const db = req.app.get('db');
		const {packing_title} = req.body;
		const {id} = req.params;

		db.packing_lists.list_update([packing_title, id])
			.then(list => res.status(200).send(list))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	delete: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing_lists.list_delete([id])
			.then(list => res.status(200).send(list))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	purge: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing_lists.list_purge([id])
			.then(list => res.status(200).send(list))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}
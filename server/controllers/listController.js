module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing_lists.list_read([id])
			.then(list => res.status(200).send(list))
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

	delete: (req, res) => {
		const db = req.app.get('db');
		const {id} = req.params;

		db.packing_lists.list_delete([id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}
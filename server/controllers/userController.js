module.exports = {
	read: (req, res) => {
		const db = req.app.get('db');

		db.user_read()
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	create: (req, res) => {
		const db = req.app.get('db');
		const {user_name, user_email, auth_id, auth_profile} = req.body;

		db.user_create([user_name, user_email, auth_id, auth_profile])
			.then(user => res.status(200).send(req.body))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	update: (req, res) => {
		const db = req.app.get('db');
		const {user_name, user_email} = req.body;
		const {params} = req;

		db.user_update([user_name, user_email, params.id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	},

	delete: (req, res) => {
		const db = req.app.get('db');
		const {params} = req;

		db.user_delete([params.id])
			.then(user => res.status(200).send(user))
			.catch(err => console.log(`Error Message: ${err}`))
	}
}
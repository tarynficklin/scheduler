module.exports = {
	read: (req, res) => {
		console.log('read')
		res.status(200).send('read')
	},

	create: (req, res) => {
		console.log('created')
		res.status(200).send('created')
	},

	update: (req, res) => {
		console.log('updated')
		res.status(200).send('updated')
	},

	delete: (req, res) => {
		console.log('deleted')
		res.status(200).send('deleted')
	}
}
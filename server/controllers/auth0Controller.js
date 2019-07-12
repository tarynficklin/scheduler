const axios = require('axios')

module.exports = {
	auth: async (req, res) => {
		const {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID, CLIENT_SECRET} = process.env;
	
		let payload = {
			client_id: REACT_APP_CLIENT_ID,
			client_secret: CLIENT_SECRET,
			code: req.query.code,
			grant_type: 'authorization_code',
			redirect_uri: `https://${req.headers.host}/auth/callback`
		}
	
		let resWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload);
		let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${resWithToken.data.access_token}`);
		const db = req.app.get('db');
	
		let {name, email, sub, picture} = resWithUserData.data;
		let foundUser = await db.users.user_find([sub]);
		
		if (foundUser[0]) {
			req.session.user = foundUser[0];
			res.redirect('/#/')
		}	else {
			let createdUser = await db.users.user_create([name, email, sub, picture]);
			req.session.user = createdUser[0];
			res.redirect('/#/');
		}
	},

	user: (req, res) => {
		if (req.session.user) {
			res.status(200).send(req.session.user);
		}
		else {
			// res.status(401).send('Access Denied');
			null
		}
	},

	logout : (req, res) => {
		req.session.destroy();
		res.status(200).send('Logged out');
	}
}
require ('dotenv').config();
const stripe = require(`stripe`)(process.env.STRIPE_SECRET_KEY);

module.exports = {
	stripe: (req, res) => {
		const pennies = [];
		const amountArray = req.body.amount.toString().split('');

		for (let i in amountArray) {
			if (amountArray[i] === ".") {

				typeof amountArray[i + 1] === "string" ? pennies.push(amountArray[i + 1]) : pennies.push("0")
				typeof amountArray[i + 2] === "string" ? pennies.push(amountArray[i + 2]) : pennies.push("0")
				break;
				
			}	else {pennies.push(amountArray[i])}
		}

		const convertedAmt = parseInt(pennies.join(''));
		const charge = stripe.charges.create({

			amount      : convertedAmt,
			currency    : 'usd',
			source      : req.body.token.id,
			description : 'Test charge from react app'

		}, (err, charge) => err ? res.sendStatus(500) : res.sendStatus(200))
	}
}
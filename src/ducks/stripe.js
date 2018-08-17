import axios from 'axios';

export let onToken = (token) => {
	token.card = void 0;
	axios.post('/api/payment', {token, amount: 500})
		.then(response => {alert('success!')})
		.catch(err => console.log(err));
};
import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';
import attachNamesAndPrices from './attachNamesAndPrices';

export default function usePizza({ pizzas, values }) {
	// 1. create some state to hold our order
	// const [order, setOrder] = useState([]); // moved useState up to OrderContext
	const [order, setOrder] = useContext(OrderContext);
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	// 2. Make a function add things to order
	function addToOrder(orderedPizza) {
		setOrder([...order, orderedPizza]);
	}

	// 3. make a function to remove things from the order
	function removeFromOrder(index) {
		setOrder([
			// everything before the item we want to remove
			...order.slice(0, index),
			// everything after the item we want to remove
			...order.slice(index + 1),
		])
	}
	// this is the function that is run when someone submits the form
	async function submitOrder(e) {
		e.preventDefault();
		console.log(e);
		setLoading(true);
		setError(null);
		// setMessage('Go eat!');

		// gatehr all the data
		const body = {
			order: attachNamesAndPrices(order, pizzas),
			total: formatMoney(calculateOrderTotal(order, pizzas)),
			name: values.name,
			email: values.email,
			mapleSyrup: values.mapleSyrup
		};
		console.log(body);
		const res = await fetch(`${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		});
		const text = JSON.parse(await res.text());

		// check if everything worked
		if (res.status >= 400 && res.status < 600) {
			setLoading(false); // turn off loading
			setError(text.message);
		} else {
			setLoading(false);
			setMessage('Success! Come on down for your pizza.');
		}
	};
	// 4. Send this data to a serverless function when they checkout.
	// todo

	return {
		order,
		addToOrder,
		removeFromOrder,
		error,
		loading,
		message,
		submitOrder
	}
}
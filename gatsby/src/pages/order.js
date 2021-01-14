import React from 'react';
import SEO from '../components/SEO';
import useForm from '../utils/useForm';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import calculatePizzaPrice from '../utils/calculatePizzaPrice';
import usePizza from '../utils/usePizza';
import formatMoney from '../utils/formatMoney';
import OrderStyles from '../styles/OrderStyles';
import MenuItemStyles from '../styles/MenuItemStyles';
import PizzaOrder from '../components/PizzaOrder';
import calculateOrderTotal from '../utils/calculateOrderTotal';

export default function OrderPage({ data }) {
	const { values, updateValues } = useForm({
		name: '',
		email: '',
		mapleSyrup: '',
		coupon: 'FREESHIP',
	});

	const pizzas = data.pizzas.nodes;

	const {
		order,
		addToOrder,
		removeFromOrder,
		error,
		loading,
		message,
		submitOrder
	} = usePizza({
		pizzas,
		values,
	});

	if (message) {
		return <p>{message}</p>;
	}

	return (
	<>
		<SEO title="Order a Pizza!"/>
		<OrderStyles onSubmit={submitOrder}>
			<fieldset disabled={loading}>
				<legend>Your Info</legend>
				<label htmlFor="name">Name</label>
				<input
					type="text"
					name="name"
					value={values.name}
					onChange={updateValues}
				/>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					name="email"
					value={values.email}
					onChange={updateValues}
				/>
				<input
					type="mapleSyrup"
					name="mapleSyrup"
					value={values.mapleSyrup}
					onChange={updateValues}
					className="maple-syrup"
				/>
				<label htmlFor="coupon">COUPON</label>
				<input
					type="text"
					name="coupon"
					value={values.coupon}
					onChange={updateValues}
				/>
			</fieldset>
			<fieldset className="menu" disabled={loading}>
				<legend>Menu</legend>
				{
					pizzas.map((pizza) => (
						<MenuItemStyles key={pizza.id}>
							<Img width="50" height="50" fluid={pizza.image.asset.fluid} alt={pizza.name}/>
							<div>
								<h2>{pizza.name}</h2>
							</div>
							<div>
								{['S', 'M', 'L'].map(size => (
									<button type="button" key={size} onClick={() => addToOrder({
										id: pizza.id,
										size
									})}>
										{size} {formatMoney(calculatePizzaPrice(pizza.price, size))}
									</button>
								))}
							</div>
						</MenuItemStyles>
					))
				}
			</fieldset>
			<fieldset className="order" disabled={loading}>
				<legend>Order</legend>
				<PizzaOrder
					order={order}
					removeFromOrder={removeFromOrder}
					pizzas={pizzas}
				/>
			</fieldset>
			<fieldset disabled={loading}>
				<h3>Your Total is {formatMoney(calculateOrderTotal(order, pizzas))}</h3>
				<div>
					{error ? <p>Error: {error}</p> : ''}
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Placing order...' : 'Order Ahead'}
				</button>
			</fieldset>
		</OrderStyles>
	</>)
}

export const query = graphql`
	query {
		pizzas: allSanityPizza {
			nodes {
				name
				id
				slug {
					current
				}
				price
				image {
					asset {
						fluid(maxWidth: 100) {
							...GatsbySanityImageFluid
						}
					}
				}
			}
		}
	}
`;
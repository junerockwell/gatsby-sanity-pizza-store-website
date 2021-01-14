import { useState, useEffect } from 'react';

const deets = `
    name
	_id
	image {
		asset {
			url
			metadata {
				lqip
			}
		}
	}
`;
export default function useLatestData() {
	// hot slices
	const [hotSlices, setHotSlices] = useState();
	// slicemasters
	const [slicemasters, setSlicemasters] = useState();

	// Use a side effect to fetch the data from the graphql endpoint
	useEffect(function() {
		// when the component loads, fetch the data
		fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: `
					query {
						StoreSettings(id: "downtown") {
							name
							slicemasters {
								${deets}
							}
							hotSlices {
								${deets}
							}
						}
					}
				`
			})
		})
		.then(res => res.json())
		.then(res => {
			// Todo: check for errors
			// set the data to state
			console.log(res);
			setHotSlices(res.data.StoreSettings.hotSlices);
			setSlicemasters(res.data.StoreSettings.slicemasters);
		})
		.catch(err => {
			console.log('Shooot');
			console.log(err);
		})
	}, []);
	return {
		hotSlices,
		slicemasters
	}
}
import { json } from '@sveltejs/kit';

export function GET({ fetch, params}) {
	
	return json(params);
}
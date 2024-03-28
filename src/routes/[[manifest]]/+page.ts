import type { PageLoad } from './$types';
import animate from '$lib/animate';

export const load = (async ({ fetch, params }) => {
    const manifestFile = params?.manifest?.replace('/','') || 'start';
    let manifestError = false;
    const start = await fetch(`json/${manifestFile}.json`)
        .then(resp => {
            if (resp.status !== 200) {manifestError = true; }
            return resp.json(); 
        })
        .catch(err => {
            console.log(err);
            manifestError = true;
        })
        ;

    return {
        animate,
        start,
        manifestFile,
        manifestError
    };
}) satisfies PageLoad;
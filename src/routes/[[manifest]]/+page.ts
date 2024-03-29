import type { PageLoad } from './$types';
import animate from '$lib/animate';


function findJson(data: any, filenames: Set<string>): void {
    if (typeof data === 'string') {
        if (data.endsWith('.json')) {
            filenames.add(data);
        }
    } else if (Array.isArray(data)) {
        for (const item of data) {
            findJson(item, filenames);
        }
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            findJson(data[key], filenames);
        }
    }
}


export const load = (async ({ fetch, params }) => {
    const manifestFile = params?.manifest?.replace('/','') || 'start';
    let manifestError = false;

    const innerJson = new Set<string>();

    const manifest = await fetch(`json/${manifestFile}.json`)
        .then(resp => {
            if (resp.status !== 200) { manifestError = true; }
            return resp.json(); 
        })
        .then(json => {
            // search for inner JSON files only goes one level from manifest file
            // so as to not need loop detection
            findJson(json, innerJson);
            return json;
        })
        .catch(err => {
            console.log(err);
            manifestError = true;
        });

    return {
        animate,
        manifest,
        innerJson,
        manifestFile,
        manifestError
    };
}) satisfies PageLoad;
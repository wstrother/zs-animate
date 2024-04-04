import type { PageLoad } from './$types';


export const load = (async ({ fetch, params }) => {
    const manifestFile = params?.manifest?.replace('/','') || 'start';

    return {
        manifestFile,
    };
}) satisfies PageLoad;
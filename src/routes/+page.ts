import type { PageLoad } from './$types';
import animate from '$lib/animate';

export const load = (async () => {
    return {
        animate
    };
}) satisfies PageLoad;
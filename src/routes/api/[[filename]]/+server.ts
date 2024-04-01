import { json } from '@sveltejs/kit';

async function loadJSONRecursively(
        url: string, 
        fetch: Function,
        loadedFiles: Map<string, boolean> = new Map(),
        encounteredFiles: Set<string> = new Set()
    ): Promise<any> {
        
    // Check for infinite loops
    if (encounteredFiles.has(url)) {
        throw new Error('Infinite recursion');
    }

    // Mark the current file as encountered
    encounteredFiles.add(url);

    // Fetch JSON data
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const jsonData = await response.json();

    // Recursively load JSON files referenced in the loaded data
    const promises: Promise<void>[] = [];
    for (const key in jsonData) {
        if (typeof jsonData[key] === 'string' && jsonData[key].endsWith('.json')) {
            const nestedUrl = `/json/${jsonData[key]}`;
            promises.push(
                loadJSONRecursively(nestedUrl, fetch, loadedFiles, new Set(encounteredFiles))
                    .then((nestedData) => {
                        jsonData[key] = nestedData;
                    })
                    .catch((error) => {
                        throw error;
                    })
            );
        }
    }
    await Promise.all(promises);

    // Mark the current file as loaded
    loadedFiles.set(url, true);

    return jsonData;
}

export async function GET({ fetch, params}) {
	const manifestFile = params?.filename?.replace('/','') || 'start';
    let manifestError = false;

    const manifest = await loadJSONRecursively(`/json/${manifestFile}.json`, fetch);
	// const manifest = await fetch(`/json/${manifestFile}.json`)
    //     .then(resp => {
    //         if (resp.status !== 200) { manifestError = true; }
    //         return resp.json(); 
    //     })
    //     // .then(json => {
    //     //     // search for inner JSON files only goes one level from manifest file
    //     //     // so as to not need loop detection
    //     //     findJson(json, innerJson);
    //     //     return json;
    //     // })
    //     .catch(err => {
    //         console.log(err);
    //         manifestError = true;
    //     });
		
	return json({
		manifestFile,
		manifestError,
		manifest
	});
}
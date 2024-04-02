import { json } from '@sveltejs/kit';

function findJson(data: any, filenames: Set<string> ): void {
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

async function loadJSONRecursively(
        filename: string, 
        fetch: Function,
        loadedFiles: Map<string, any>,
        encounteredFiles: Set<string> = new Set(),
        searchedFiles: Set<string>|undefined = undefined
    ): Promise<Map<string, any>> {
    
    // Check if the file has already been loaded
    if (loadedFiles.has(filename)) {
        return loadedFiles.get(filename);
    }
    console.log(`Loading ${filename}`);

    // Check for infinite loops at the current recursion level
    if (searchedFiles) {
        if (searchedFiles.has(filename)) {
            throw new Error('Infinite recursion');
        }
        searchedFiles.add(filename);
    }

    // Mark the current file as encountered
    // encounteredFiles.add(filename);
    

    // Fetch JSON data
    // loadedFiles.set(filename, true);
    const response = await fetch(`/json/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch /json/${filename}: ${response.statusText}`);
    }
    const jsonData = await response.json();

    // Mark the current file as loaded
    loadedFiles.set(filename, jsonData);

    // Search the data for inner json files
    findJson(jsonData, encounteredFiles);

    // Recursively load inner json files
    const promises: Promise<Map<string, any>>[] = [];
    for (const innerFilename of encounteredFiles) {
        if (!searchedFiles) searchedFiles = new Set();

        promises.push(
            loadJSONRecursively(innerFilename, fetch, loadedFiles, encounteredFiles, searchedFiles)
                .catch((error) => {
                    throw error;
                })
        );
    }
    await Promise.all(promises);

    return loadedFiles;
}

export async function GET({ fetch, params}) {
	const manifestFile = `${(params?.filename?.replace('/','') || 'start')}.json`;
    let manifestError = false;

    const loadedFiles = await loadJSONRecursively(manifestFile, fetch, new Map());
    console.log(loadedFiles);
    const manifest = loadedFiles.get(manifestFile);
		
	return json({
		manifestFile,
		manifestError,
		manifest
	});
}
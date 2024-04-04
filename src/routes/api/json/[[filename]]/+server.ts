import { error, json } from '@sveltejs/kit';


function findInnerJson(
    jsonData: Record<string,any>,
    callback: (parentKey:any, parentItem:any) => void
) {
    const checkItem = (callback: (pk:any, pi:any) => void, parentItem: any, parentKey: any) => {
        const item = parentItem[parentKey];
    
        if (typeof item === 'string') {
            if (item.endsWith('.json')) {
                callback(parentKey, parentItem);
            }
        } else {
            for (const key of Object.keys(item)) {
                checkItem(callback, item, key)
            }
        }
    }

    for (const key in jsonData) {
        checkItem(callback, jsonData, key);
    }
}


async function loadJsonRecursively(
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

    // Check for infinite loops at the current recursion level
    if (searchedFiles) {
        if (searchedFiles.has(filename)) {
            throw new Error('Infinite recursion');
        }
        searchedFiles.add(filename);
    }

    // Fetch JSON data
    const response = await fetch(`/json/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch /json/${filename}: ${response.statusText}`);
    }
    const jsonData = await response.json();

    // Mark the current file as loaded
    loadedFiles.set(filename, jsonData);

    // Search the data for inner json file aliases
    findInnerJson(jsonData, (k:any, i:any) => encounteredFiles.add(i[k]));

    // Recursively load encounterd json file aliases
    const promises: Promise<Map<string, any>>[] = [];
    for (const innerFilename of encounteredFiles) {
        
        if (!searchedFiles) searchedFiles = new Set();
        promises.push(
            loadJsonRecursively(innerFilename, fetch, loadedFiles, encounteredFiles, searchedFiles)
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

    try {
        // load json files recursively
        const loadedFiles = await loadJsonRecursively(manifestFile, fetch, new Map());
        const manifest = loadedFiles.get(manifestFile);
    
        // substitue json file aliases for loaded data
        loadedFiles.forEach(jsonData => {
            findInnerJson(jsonData, (k:any, i:any) => i[k] = loadedFiles.get(i[k]));
        });
        
        return json(manifest);
    } catch (err) {
        console.log(err)
        throw error(500, `Error encountered while fetching ${manifestFile}`);
    }
}
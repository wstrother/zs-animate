import { json } from '@sveltejs/kit';

function findJsonFilenames(
        callback: (s:string) => void,
        item: string|Array<any>|Record<string, any>
    ): void {

    if (typeof item === 'string') {
        if (item.endsWith('.json')) {
            callback(item);
        }
    } else if (Array.isArray(item)) {
        for (const [i, element] of item.entries()) {
            findJsonFilenames(callback, element);
        }
    } else if (typeof item === 'object' && item !== null) {
        for (const key in item) {
            findJsonFilenames(callback, item[key]);
        }
    }
}

function replaceJson(
        callback: (parentItem:any, parentKey:any, item:any) => void,
        parentItem: any, 
        parentKey: any,
    ): void {
    
    const item = parentItem[parentKey];

    if (typeof item === 'string') {
        if (item.endsWith('.json')) {
            callback(parentItem, parentKey, item);
        }
    } else if (Array.isArray(item)) {
        for (const [i, element] of item.entries()) {
            replaceJson(callback, element, i);
        }
    } else if (typeof item === 'object' && item !== null) {
        for (const key in item) {
            replaceJson(callback, item[key], key);
        }
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
    console.log(`Loading ${filename}`);

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
    findJsonFilenames(
        s => encounteredFiles.add(s), 
        jsonData
    );

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
    let manifestError = false;

    // load json files recursively
    const loadedFiles = await loadJsonRecursively(manifestFile, fetch, new Map());
    const manifest = loadedFiles.get(manifestFile);

    // substitue json file aliases for loaded data
    for (const [name, data] of loadedFiles) {
        for (const key in data) {
            replaceJson((parentItem:any, parentKey:any, item:any) => {
                console.log(parentItem, parentKey, item);
                parentItem[parentKey] = loadedFiles.get(item);
            }, data, key);
        }
    }
    
		
	return json({
		manifestFile,
		manifestError,
		manifest
	});
}
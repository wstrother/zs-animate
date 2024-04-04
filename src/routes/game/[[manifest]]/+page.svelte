<script lang='ts'>
    import { loadedJSON, loadedSpritesheets, loadedTextures, appStage } from '$lib/stores.js';
    import create from '$lib/create';
    
    export let data;
    let destroyApp: undefined | Function;
    let manifestError: boolean = false;
    let manifestErrMessage: string = '';
    
    
    const loadApp = async () => {
        if (destroyApp) destroyApp();

        // if (!data.manifestError) {
        //     const canvasElement = document.getElementById('appCanvas');
        //     if (canvasElement) {
        //         await data.animate.createApp(canvasElement, data.manifest)
        //             .then(({ textures, spritesheets, jsonFiles, stage, destroy }) => {
        //                 loadedTextures.set(textures);
        //                 loadedJSON.set(jsonFiles);
        //                 loadedSpritesheets.set(spritesheets);
        //                 appStage.set(stage);
        //                 destroyApp = destroy;
        //             });
        //     }
        // }

        const resp = await fetch(`/api/json/${data.manifestFile}`);
        if (resp.ok) {
            manifestError = false;
            const jsonData = await resp.json();
            console.log(jsonData);
        } else {
            manifestError = true;
            manifestErrMessage = resp.statusText;
        }
    }
</script>

<div id="appCanvas">
    {#if manifestError }
        <div class="ml-5">
            <h3 class="h3">Error Loading Manifest file</h3>
                <pre>{manifestErrMessage}</pre>
        </div>
    {/if}
</div>

<div id="controls">
    <button on:click={loadApp} class="btn btn-md">Create app</button>
</div>

<style>
    #appCanvas {
        margin: 1rem;
        width: 800px;
        height: 600px;
    }

    #controls {
        margin: 1rem;
    }
</style>
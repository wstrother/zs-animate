<script lang='ts'>
    import { loadedJSON, loadedSpritesheets, loadedTextures, appStage } from '$lib/stores.js';

    export let data;
    let destroyApp: undefined | Function
    
    const create = async () => {
        if (destroyApp) destroyApp();

        if (!data.manifestError) {
            const canvasElement = document.getElementById('appCanvas');
            if (canvasElement) {
                await data.animate.createApp(canvasElement, data.manifest)
                    .then(({ textures, spritesheets, jsonFiles, stage, destroy }) => {
                        loadedTextures.set(textures);
                        loadedJSON.set(jsonFiles);
                        loadedSpritesheets.set(spritesheets);
                        appStage.set(stage);
                        destroyApp = destroy;
                    });
            }
        }
    }
</script>

<div id="appCanvas">
    {#if data.manifestError }
        <div class="ml-5">
            <h3 class="h3">Error Loading Manifest file</h3>
            <p>Could not load file at path:</p> 
                <pre>json/{data.manifestFile}.json</pre>
        </div>
    {/if}
</div>

<div id="controls">
    <button on:click={create} class="btn btn-md">Create app</button>
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
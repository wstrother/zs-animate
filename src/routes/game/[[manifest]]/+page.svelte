<script lang='ts'>
    import { loadedSpritesheets, loadedTextures, appStage } from '$lib/stores.js';
    import create from '$lib/create';
    
    export let data;
    let destroyApp: undefined | Function;
    let manifestError: boolean = false;
    let manifestErrMessage: string = '';
    
    
    const loadApp = async () => {
        if (destroyApp) destroyApp();

        const resp = await fetch(`/api/json/${data.manifestFile}`);
        if (!resp.ok) {
            manifestError = true;
            manifestErrMessage = resp.statusText;
            return;
        }

        manifestError = false;
        const jsonData = await resp.json();
        console.log(jsonData);

        const canvasElement = document.getElementById('appCanvas');
        if (canvasElement) {
            await create.createApp(canvasElement, jsonData)
                .then(({ textures, spritesheets, stage, destroy }) => {
                    loadedTextures.set(textures);
                    loadedSpritesheets.set(spritesheets);
                    appStage.set(stage);
                    destroyApp = destroy;
                });
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
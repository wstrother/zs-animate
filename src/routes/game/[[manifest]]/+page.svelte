<script lang='ts'>
    import { loadedSpritesheets, loadedTextures, appStage } from '$lib/stores.js';
    import create from '$lib/create';
    
    export let data;
    let destroyApp: undefined | Function;
    let _startApp: undefined | Function;
    let _stopApp: undefined | Function;
    let _updateApp: undefined | Function;
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
                .then(({ textures, spritesheets, app, destroy, start, stop, update }) => {
                    loadedTextures.set(textures);
                    loadedSpritesheets.set(spritesheets);
                    appStage.set(app.stage);
                    destroyApp = destroy;
                    _startApp = start;
                    _stopApp = stop;
                    _updateApp = update;
                });
        }
    }

    const startApp = () => {
        if (_startApp) _startApp();
    }
    const stopApp = () => {
        if (_stopApp) _stopApp();
    }
    const updateApp = () => {
        if (_updateApp) _updateApp();
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
    <button on:click={startApp} class="btn btn-md">Start app</button>
    <button on:click={stopApp} class="btn btn-md">Stop app</button>
    <button on:click={updateApp} class="btn btn-md">Update app</button>
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
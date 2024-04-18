<script lang='ts'>
    import { loadedSpritesheets, loadedTextures, appStage, loadedEntities } from '$lib/stores.js';
    import create from '$lib/create';
	import Entity from '$lib/ui/entity.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    
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

        const canvasElement = document.getElementById('appCanvas');
        if (canvasElement) {
            await create.createApp(canvasElement, jsonData)
                .then(({ textures, spritesheets, entities, app, destroy, start, stop, update }) => {
                    loadedTextures.set(textures);
                    loadedSpritesheets.set(spritesheets);
                    loadedEntities.set(entities);
                    console.log(entities);
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
<div class="flex flex-row">
    
    <div class="flex flex-col">
    
        <div id="appCanvas">
            {#if manifestError }
                <div class="ml-5">
                    <h3 class="h3">Error Loading Manifest file</h3>
                        <pre>{manifestErrMessage}</pre>
                </div>
            {/if}
        </div>
    
        <div id="controls">
            <button on:click={loadApp} class="btn btn-md variant-filled">Create app</button>
            <button on:click={startApp} class="btn btn-md variant-filled">Start app</button>
            <button on:click={stopApp} class="btn btn-md variant-filled">Stop app</button>
            <button on:click={updateApp} class="btn btn-md variant-filled">Update app</button>
        </div>
    </div>
    
    <div class="m-5">
        <div class="h3">Entities</div>

        <Accordion autocollapse>
            {#each $loadedEntities as entity }
                <AccordionItem>
                    <svelte:fragment slot="summary">{entity.name}</svelte:fragment>
                    <svelte:fragment slot="content">
                        <Entity {entity} />
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>

    </div>
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
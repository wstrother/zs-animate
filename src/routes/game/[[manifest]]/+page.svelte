<script lang='ts'>
    import { loadedSpritesheets, loadedTextures, appStage, loadedEntities } from '$lib/stores.js';
    import create from '$lib/create/createApp.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { Entity } from '$lib/entities.js';
	import EntityUi from '$lib/ui/entityUI.svelte';
	import { Graphics } from 'pixi.js';
    
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

    let selectedEntity: Entity | undefined;
    let selectedGraphics: Graphics | undefined;

    const selectEntity = (e: Entity) => {
        if (selectedEntity !== e) {
            selectedEntity = e;

            selectedGraphics = new Graphics()
                .rect(0, 0, 20, 20)
                .stroke({
                    color: 'ff0000',
                    width: 2
                });
            $appStage?.addChild(selectedGraphics);
            console.log(e);
        }
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
            <button on:click={loadApp} class="btn btn-sm variant-filled">Create app</button>
            <button on:click={startApp} class="btn btn-sm variant-filled">Start app</button>
            <button on:click={stopApp} class="btn btn-sm variant-filled">Stop app</button>
            <button on:click={updateApp} class="btn btn-sm variant-filled">Update app</button>
        </div>
    </div>
    
    <div class="m-5 variant-filled-primary rounded-md p-1 w-[400px]">
        <div class="h3 mx-2">Entities</div>

        <Accordion autocollapse>
            {#each $loadedEntities as entity }
                <AccordionItem on:toggle={()=>selectEntity(entity)}>
                    <svelte:fragment slot="summary">{entity.name}</svelte:fragment>
                    <svelte:fragment slot="content">
                        <EntityUi {entity} />
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>

    </div>
</div>

<style>
    #appCanvas {
        margin: 1rem;
        width: 500px;
        height: 400px;
    }

    #controls {
        margin: 1rem;
    }
</style>
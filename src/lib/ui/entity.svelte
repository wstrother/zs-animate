<script lang='ts'>
    import { Entity } from "$lib/entities";
	import Graphics from "./graphics.svelte";
    export let entity: Entity;

    const togglePause = () => {
        entity.paused = !entity.paused;
    }
</script>

<div class="flex flex-col variant-soft-secondary p-4 rounded-md">
    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="btn btn-sm variant-filled" on:click={togglePause}>
            { !entity.paused ? 'Pause' : 'Unpause'}
        </div>
    
        {#if entity.components.has('Graphics')}
            <Graphics graphics={entity.components.get('Graphics')} />
        {/if}
</div>

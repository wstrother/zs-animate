<script lang='ts'>
    import { Entity } from "$lib/entities";
    export let entity: Entity;

    const togglePause = () => {
        entity.paused = !entity.paused;
    }
</script>
<div class="flex flex-col variant-ghost-tertiary p-4 rounded-md">
    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="btn btn-sm variant-filled" on:click={togglePause}>
            { !entity.paused ? 'Pause' : 'Unpause'}
        </div>
    
        {#if entity.components.has('Graphics')}
            Graphics
        {/if}
</div>

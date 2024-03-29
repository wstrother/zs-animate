<script lang='ts'>
    export let data;
    
    const log = async () => {
        if (!data.manifestError) {
            const canvasElement = document.getElementById('appCanvas');
            if (canvasElement) {
                await data.animate.createApp(canvasElement, data.manifest);
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
    <button on:click={log} class="btn btn-md">Click me</button>
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
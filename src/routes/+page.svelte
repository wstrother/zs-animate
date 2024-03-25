<script lang='ts'>
    export let data;

    const log = async () => {
        const canvasElement = document.getElementById('appCanvas');
        if (canvasElement) {
            await data.animate.createApp(canvasElement);
        }
    }
</script>

<div id="appCanvas"></div>

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
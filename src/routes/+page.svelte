<script lang='ts'>
    export let data;

    const log = () => {
        data.animate.createApp();
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={log}>Click me</button>
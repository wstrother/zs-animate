<script lang='ts'>
	import { AnimationGraphics, ImageGraphics } from '$lib/components/graphics';
	import type { EntityComponent } from '$lib/entities';

    
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    let activeState: string;

    export let graphics: EntityComponent | undefined;
    let anim: AnimationGraphics | undefined;
    let image: ImageGraphics | undefined;

    if (graphics instanceof(AnimationGraphics)) {
        anim = graphics;
        activeState = anim.state;
    }

    if (graphics instanceof(ImageGraphics)) {
        image = graphics;
    }

</script>

{#if graphics}
    <div class="mt-4 variant-filled-tertiary p-1 rounded-sm text-xs">
        {graphics.name}

        {#if anim}
            <ListBox>
                {#each anim.states as state}
                    <ListBoxItem 
                        bind:group={activeState} 
                        name="activeState"
                        on:change={() => anim?.setState(state)}
                        value={state}>
                        {state}
                    </ListBoxItem>
                {/each}
            </ListBox>
        {/if}

        {#if image}
            hello
        {/if}
    </div>
{/if}
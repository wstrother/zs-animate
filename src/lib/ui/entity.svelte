<script lang='ts'>
    import { Entity } from "$lib/entities";

    export let entity: Entity;
</script>

<div>{entity.name ?? 'some entity'}</div>
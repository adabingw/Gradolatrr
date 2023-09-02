<script>
    import { createEventDispatcher } from "svelte";

    export let info;
    export let selected;

    const dispatch = createEventDispatcher();

    function typeChange() {
        dispatch('message', {
            data: selected
        });
    }
</script>

<div>
    <select name="tags" bind:value={selected} on:change={typeChange}>
        {#each info as i}
            <option value={i}>{i}</option>
        {/each}
    </select>
</div>

<style>
select {
    padding: 6px;
}
</style>

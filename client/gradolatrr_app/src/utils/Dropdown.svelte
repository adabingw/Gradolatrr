<script>
    export let info;
    export let selected;
</script>

<div>
    <select name="tags" bind:value={selected}>
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

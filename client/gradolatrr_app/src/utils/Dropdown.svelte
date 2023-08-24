<script>
    export let info;
    export let selected;
</script>

<div>
    <select name="tags" bind:value={selected}>
        {#each info as i}
            {#if i instanceof String}
                <option value={i}>{i}</option>
            {:else}
                <option value={i[0]}>{i[0]}</option>
            {/if}
        {/each}
    </select>
</div>

<style>
    
</style>

<script>
    export let info;
</script>

<div>
    <select name="tags">
        {#each info as i}
            <option value={i[0]}>{i[0]}</option>
        {/each}
    </select>
</div>

<style>
    
</style>

<script>
    export let inputText;
    export let changed;
</script>

<div class="input-row">
    <input type="text" class="input-text" bind:value={inputText} 
            on:change={() => {changed = true;}} 
            on:input={() => {changed = true;}}/>
</div>

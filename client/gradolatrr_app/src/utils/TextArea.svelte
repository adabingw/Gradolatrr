<script>
    import { createEventDispatcher } from 'svelte';

    export let inputText;
    const dispatch = createEventDispatcher();

    function dataChange() {
        dispatch('message', {
            text: "data changed"
        });
    }
</script>

<div class="input-row">
    <input type="text" class="input-text" bind:value={inputText} on:change={dataChange} on:input={dataChange} />
</div>

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
    <textarea class="input-text" rows="4" cols="50" bind:value={inputText} on:change={dataChange} on:input={dataChange} />
</div>

<style>
.input-text {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 550px;
    height: 50px;
}

textarea {
    resize: vertical;
}
</style>

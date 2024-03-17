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
    <textarea class="input-text" rows="4" cols="50" placeholder="nothing here yet..."
        bind:value={inputText} on:change={dataChange} on:input={dataChange} />
</div>

<style>
.input-text {
    margin-top: 5px;
    margin-bottom: 20px;
    width: 60vw;
    margin-left: 3px;
    height: 50px;
}

textarea {
    resize: vertical;
    border: none;
}

textarea:focus {
    border: 0 none #FFF;
    outline: none;
}
</style>

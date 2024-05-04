<script>
    import { createEventDispatcher } from 'svelte';

    export let inputText;
    const dispatch = createEventDispatcher();
    let textarea;

    function dataChange() {
        console.log(textarea.scrollHeight.toString() + "px")
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight.toString() + "px";
        dispatch('message', {
            text: "data changed"
        });
        
    }
</script>

<div class="input-row">
    <textarea class="input-text" cols="50" placeholder="empty"
        bind:value={inputText} on:change={dataChange} on:input={dataChange} bind:this={textarea}/>
</div>

<style>
.input-text {
    margin-top: 5px;
    width: 60vw;
    margin-left: 3px;
}

textarea {
    resize: none;
    border: none;
}

textarea:focus {
    border: 0 none #FFF;
    outline: none;
}
</style>

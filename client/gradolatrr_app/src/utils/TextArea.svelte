<script>
    import { createEventDispatcher } from 'svelte';

    export let inputText;
    export let style;
    const dispatch = createEventDispatcher();
    let textarea;

    if (!style) style = '60vw'

    function dataChange(e) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight.toString() + "px";
        dispatch('message', {
            text: "data changed",
            value: e.target.value
        });
        
    }
</script>

<div class="input-row">
    <textarea class="input-text" cols="50" placeholder="empty"
        style={`width: ${style}`}
        bind:value={inputText} on:change={dataChange} on:input={dataChange} bind:this={textarea}
        on:focusout={() => {
            console.log("toiquoequrowe")
            dispatch('blur', {
                text: "blur"
            });
        }}
    />
</div>

<style>
.input-text {
    margin-top: 5px;
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

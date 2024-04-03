<script>
    export let text;
    export let icon;
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function dispatchSave() {
        dispatch('message', {
            text: 'clicked'
        });
    }
</script>

<p class="button" on:click={() => dispatchSave()}>
    {#if icon != ""}
        <i class={icon}></i>
    {/if}
    {text}
</p>

<style>
.button {
    /* margin-left: 8px;
    margin-right: 8px; */
    border-radius: 5px;
    font-size: 15px;
    width: fit-content;
    padding: 5px 8px 5px 8px;
    border: 1px solid #717171;
}

.button:hover {
  /* font-weight: bold; */
  cursor: pointer;
  /* background-color: #e8e5df; */
}
</style>

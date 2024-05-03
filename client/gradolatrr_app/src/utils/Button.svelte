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
    font-size: 15px;
    width: fit-content;
}

.button:hover {
  /* font-weight: bold; */
  cursor: pointer;
  /* background-color: #e8e5df; */
}
</style>

<script>
    export let text;
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function dispatchSave() {
        dispatch('message', {
            text: 'clicked'
        });
    }
</script>

<p class="term-changes" on:click={() => dispatchSave()}>{text}</p>

<style>
.term-changes:hover {
  font-weight: bold;
  cursor: pointer;
}
</style>

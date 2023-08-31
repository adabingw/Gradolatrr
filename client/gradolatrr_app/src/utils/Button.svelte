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
.term-changes {
    margin-left: 8px;
    margin-right: 8px;
    border-radius: 12px;
    width: fit-content;
    padding: 8px;
    font-weight: bold;
}

.term-changes:hover {
  font-weight: bold;
  cursor: pointer;
  background-color: #D7DBCF;
}
</style>

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
    /* margin-left: 8px;
    margin-right: 8px; */
    border-radius: 5px;
    width: fit-content;
    padding: 5px;
    font-weight: 600;
}

.term-changes:hover {
  font-weight: bold;
  cursor: pointer;
  background-color: #e8e5df;
}
</style>

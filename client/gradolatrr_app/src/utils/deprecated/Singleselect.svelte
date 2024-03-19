<!-- https://www.npmjs.com/package/svelte-multiselect -->
<!-- https://svelte.dev/repl/a5a14b8f15d64cb083b567292480db05?version=4.2.0 -->

<script>
    import MultiSelect from 'svelte-multiselect'
    import { createEventDispatcher } from 'svelte';

    export let properties;
    export let selected;
    const dispatch = createEventDispatcher();
</script>
    
{#if properties != undefined}
    <MultiSelect
        id="tags"
        options={properties}
        selected={selected}
        placeholder="pick tags"
        maxSelect={1}
        on:add={(event) => {
            dispatch('message', {
                data: event.detail.option
            });
        }}
    />
{/if}
  
<style>

</style>
  
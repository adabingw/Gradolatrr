<script>
    import { createEventDispatcher } from 'svelte';

    export let date;    
    const dispatch = createEventDispatcher();

    function newDateSelected() {
        console.log(date);
        dispatch('message', {
            data: date
        })
    }

</script>

<div>
    <input type="date" bind:value={date} on:select={newDateSelected} on:change={newDateSelected}>
</div>

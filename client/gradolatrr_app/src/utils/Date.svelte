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

<style>
input {
    border: 0px solid white;
    margin-left: 3px;
}

input:hover {
    outline: none;
    border: 0 none #FFF;
}
</style>

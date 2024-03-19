<script>
    import { createEventDispatcher } from 'svelte';

    export let date;    
    const dispatch = createEventDispatcher();

    function newDateSelected() {
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
    color: #919191;
    border: 0px solid white;
    margin-left: 3px;
}
</style>

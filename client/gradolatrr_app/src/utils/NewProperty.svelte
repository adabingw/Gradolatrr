<script>
    import TextField from "./TextField.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Button from "./Button.svelte";
    import { TERM_TYPES } from "../constants/constants";

    import { createEventDispatcher } from 'svelte';

    export let data;
    let add = false;
    let name; 
    let type;
    const dispatch = createEventDispatcher();

    function addProperty() {
        add = !add;
    }

    function saveProperty() {
        if (name == undefined) {
            alert("Name is required");
            return;
        }

        for (let d of data) {
            if (d[0] == name) {
                alert("Name already exists");
                return;
            }
        }

        add = false;
        dispatch('message', {
            name: name, 
            type: type
        });

        name = "";
    }

</script>

<div class="row">
    <Button text="" icon="fa-solid fa-plus fa-xs" on:message={addProperty} />
    {#if add}
    <div class="add-row">
        <TextField bind:inputText={name} text="name" type="text" max="" min="" focus={true} on:enter={saveProperty}/>
        <Dropdown info={TERM_TYPES} bind:selected={type}/>
    </div>
    <div class="save-div">
        <i class="fa-solid fa-check" on:click={() => saveProperty()}></i>
    </div>
    {/if}
</div>

<style>
.row {
    display: flex; 
    flex-direction: row;
    align-items: baseline;
}

.add-row {
    display: flex; 
    flex-direction: row;
    align-items: baseline;
    margin-left: 25px;
}

.fa-solid {
    margin-right: 30px;
}

.save-div {
    margin-left: 40px;
}
</style>

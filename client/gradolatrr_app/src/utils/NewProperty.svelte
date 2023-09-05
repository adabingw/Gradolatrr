<script>
    import TextField from "./TextField.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Button from "./Button.svelte";
    import { TYPES } from "../constants/constants";

    import { createEventDispatcher } from 'svelte';

    export let data;
    let add = false;
    let name; 
    let type;
    const dispatch = createEventDispatcher();

    function addProperty() {
        add = true;
    }

    function saveProperty() {
        if (name == undefined) {
            alert("name is required");
            return;
        }

        for (let d of data) {
            if (d[0] == name) {
                alert("name already exists");
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

    function cancelProperty() {
        add = false;
    }

</script>

<div>
    {#if add} 
    <div class="add-row">
        <TextField bind:inputText={name} text="name" type="text" max="" min="" focus={true} on:enter={saveProperty}/>
        <Dropdown info={TYPES} bind:selected={type}/>
    </div>
    <div class="save-div">
        <Button text="save" on:message={saveProperty} />
        <Button text="cancel" on:message={cancelProperty} />
    </div>
    {:else}
        <Button text="+add properties" on:message={addProperty} />
    {/if}
</div>

<style>
.add-row {
    display: flex; 
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
}

.save-div {
    display: flex;
    flex-direction: row;
}
</style>

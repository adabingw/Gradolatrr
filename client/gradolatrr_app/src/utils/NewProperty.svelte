<script>
    let add = false;
    let name; 
    let type;

    import TextField from "./TextField.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Button from "./Button.svelte";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let types = ["text", "number", "tags", "textarea"];

    function addProperty() {
        add = true;
    }

    function saveProperty() {
        if (name == undefined) {
            alert("name is required");
            return;
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
        <TextField bind:inputText={name} text="name" type="text" />
        <Dropdown info={types} bind:selected={type}/>
    </div>
        <Button text="save" on:message={saveProperty} />
        <Button text="cancel" on:message={cancelProperty} />
    {:else}
        <Button text="+add properties" on:message={addProperty} />
    {/if}
</div>

<style>
.add-row {
    display: flex; 
    flex-direction: row;
    align-items: center;
}
</style>

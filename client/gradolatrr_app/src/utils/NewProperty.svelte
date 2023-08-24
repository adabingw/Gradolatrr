<script>
    let add = false;
    let name; 
    let type;

    import TextField from "./TextField.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Button from "./Button.svelte";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let types = [["text", 0], ["number", 0], ["tags", 0], ["textarea", 0]];

    function addProperty() {
        add = true;
    }

    function saveProperty() {
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
        <TextField bind:inputText={name} text="name" type="text" />
        <Dropdown info={types} bind:selected={type}/>
        <Button text="save" on:message={saveProperty} />
        <Button text="cancel" on:message={cancelProperty} />
    {:else}
        <Button text="+add properties" on:message={addProperty} />
    {/if}
</div>

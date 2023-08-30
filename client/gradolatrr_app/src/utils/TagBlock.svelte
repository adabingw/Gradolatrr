<script>
    export let properties;
    let add = false;
    let tag_name;

    import { createEventDispatcher } from 'svelte';

    import Button from "./Button.svelte";
    import TextField from "./TextField.svelte";
    import colours from "../constants/colours.json";

    const dispatch = createEventDispatcher();

    function addTag() {
        console.log("add")
        add = true;
    }

    function saveTag(e) {
        console.log("save tag")
        add = false;

        let rand = Math.floor(Math.random() * 17);

        dispatch('message', {
            tags: [...properties, tag_name]
        });

        tag_name = "";
    }

    function cancelTag() {
        console.log("cancel tag")
        add = false;
    }
</script>

<div>
    <div class="tag-block">
        {#each properties as tag}
            <div class="tag">
                {tag}
            </div>
        {/each}
    </div>
    {#if add}
        <TextField bind:inputText={tag_name} type="text" text=""/>
        <Button text="save" on:message={saveTag} />
        <Button text="cancel" on:message={cancelTag} />
    {:else}
        <Button text="+ add tag" on:click={addTag} on:message={addTag}/>
    {/if}
</div>

<style>
.tag {
    text-align: center;
    border-radius: 12px;
    background-color: lightgray;
    padding-top: 8px;
    padding-bottom: 8px; 
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 8px;
    width: 100px;
}

.tag-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

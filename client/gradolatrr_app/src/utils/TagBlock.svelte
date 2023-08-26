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
            tag: tag_name,
            colour: colours[rand]
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
            <div class="tag" style={`background-color: ${tag[1]}`}>
                {tag[0]}
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
    padding-top: 8px;
    padding-bottom: 8px; 
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 8px;
    width: 100px;
}
</style>

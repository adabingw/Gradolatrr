<script>
    export let properties;
    let add = false;
    let tag_name;

    import { createEventDispatcher } from 'svelte';

    import Button from "../Button.svelte";
    import TextField from "../TextField.svelte";
    import Close from "../assets/delete_icon.png";

    const dispatch = createEventDispatcher();

    function addTag() {
        add = true;
    }

    function saveTag(e) {
        for (let p of properties) {
            if (tag_name == p) {
                alert("Tag already exists");
                return;
            }
        }

        add = false;
        dispatch('message', {
            message: "add",
            tags: [...properties, tag_name]
        });

        tag_name = "";
    }

    function deleteTag(tag, index) {
        properties.splice(index, 1);
        dispatch('message', {
            message: "delete",
            tags: [...properties]
        });
    }

    function cancelTag() {
        add = false;
    }
</script>

<div class="tags-modal">
    <div class="tag-block">
        {#each properties as tag, i}
        <div class="tag-row">
            <div class="tag">
                {tag}
            </div>
            <i class="fa-solid fa-xmark" on:click={() => deleteTag(tag, i)}></i>
            <!-- <img src={Close} on:click={() => deleteTag(tag, i)} alt="close"/> -->
        </div>
        {/each}
    </div>
    {#if add}
        <TextField bind:inputText={tag_name} type="text" text="" 
            min="" max="" focus={true} on:enter={saveTag} />
        <div class="tag-row">
            <Button text="save" on:message={saveTag} />
            <Button text="cancel" on:message={cancelTag}/>
        </div>
    {:else}
        <Button text="+ add tag" on:click={addTag} on:message={addTag}/>
    {/if}
</div>

<style>
.tags-modal {
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
}

.tag {
    text-align: center;
    border-radius: 12px;
    background-color: lightgray;
    padding-top: 8px;
    padding-bottom: 8px; 
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 4px;
    margin-top: 4px;
    width: 100px;
    margin-right: 8px;
}

.tag-row {
    display: flex; 
    flex-direction: row;
    align-items: center;
}

.tag-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

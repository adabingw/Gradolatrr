<script>
// @ts-nocheck
// https://svelte.dev/examples/modal

    import { createEventDispatcher } from 'svelte';
    import { Table, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";

    import Close from "../assets/delete_icon.png";
    import Open from "../assets/open_icon.png";
    import Button from './Button.svelte';
    import TextField from './TextField.svelte';
    import Dropdown from './Dropdown.svelte';
    import Modal from './Modal.svelte';
    import TagBlock from './TagBlock.svelte';

    export let courseinfo;

    let add = false;
    let info_name;
    let info_type;
    let types = ["text", "number", "tags", "textarea"];
    let showModal = false;
    let modalName = "";
    let properties = ["assignment", "final", "midterm"];

    const dispatch = createEventDispatcher();

    function checkInfo(name) {
        dispatch('info', {
            info: 'checked'
        })
    }

    function addInfo() {
        add = true;
    }

    function tagChange(event) {
        console.log("add tag");
        const tags = event.detail.tags;
        courseinfo[modalName]["tag_info"] = tags;
        properties = courseinfo[modalName]["tag_info"];
        dispatch('info', {
            info: 'tag',
            tags: tags, 
            info_name: modalName
        });
    }

    function saveInfo() {
        if (info_name == undefined) {
            alert("name is required");
            return;
        }

        for (let item of Object.keys(courseinfo)) {
            if (item == info_name) {
                alert("name already exists");
                return;
            }
        }

        let new_info = {
            "checked": true, 
            "type": info_type, 
            "required": false,
            "order": 0
        }
        if (info_type == "tags") new_info["tag_info"] = [];
        courseinfo[info_name] = new_info;
        dispatch('info', {
            info: 'saved',
            new_info: new_info, 
            info_name: info_name
        });
        add = false;
        info_name = "";
    }

    function cancelInfo() {
        add = false;
    }

    function deleteTag(name) {
        dispatch('info', {
            info: 'delete',
            data: name
        })

        info_name = "";
    }

    function openModal(item, item_name) {
        showModal = true;
        modalName = item_name;
        properties = item["tag_info"];
    }

</script>

<div>
    <Modal bind:showModal>
        <h2 slot="header">
            {modalName}
        </h2>
        <TagBlock properties={properties} on:message={tagChange}/>    
    </Modal>
    <Table><TableBody>
    <div class="property-table">
    {#each Object.keys(courseinfo) as item}
        <TableBodyRow>
        <!-- svelte-ignore empty-block -->
            <div class="type-block">
                <div class="type-block2" >
                    <TableBodyCell>
                    <p class="tag-check">
                    {#if !courseinfo[item]["required"]}
                        <input type="checkbox"
                        bind:checked={courseinfo[item]["checked"]} 
                        on:change={() => {checkInfo(item)}}/>
                    {:else}
                        &nbsp; &nbsp;
                    {/if} {item}
                    </p>
                    </TableBodyCell>
                    <TableBodyCell><p>{courseinfo[item]["type"]}</p></TableBodyCell>
                </div>
                <TableBodyCell>
                    {#if courseinfo[item]["type"] == "tags"}
                        <img src={Open} on:click={() => openModal(courseinfo[item], item)} alt="open" class="open-icon" />
                    {:else} 
                        <p  class="open-icon"></p>
                    {/if}
                </TableBodyCell>
                <TableBodyCell>
                    {#if !courseinfo[item]["required"]}
                        <img src={Close} on:click={() => deleteTag(item)}/>
                    {/if}
                </TableBodyCell>
            </div>
        </TableBodyRow>
    {/each}
    </div>
    </TableBody></Table>
    {#if add}
    <div class="add-row">
        <TextField bind:inputText={info_name} type="text" text=""/>
        <Dropdown info={types} bind:selected={info_type}/>
    </div>
        <Button text="save" on:message={saveInfo} />
        <Button text="cancel" on:message={cancelInfo} />
    {:else}
        <Button text="+ add course info" on:click={() => addInfo()} on:message={addInfo} class="add-info"/>
    {/if}
</div>

<style>
.property-table {
  margin-top: 15px;
}

.add-row {
    display: flex; 
    flex-direction: row;
    align-items: center;
}

.type-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  line-height: 25px;  
}

.type-block2 {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 250px;
  line-height: 2px;
  height: 25px;
}

.tag-check {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 150px;
  line-height: 5px;
  height: 5px;
}

.open-icon {
  padding-left: 10px;
  padding-right: 10px;
}

</style>

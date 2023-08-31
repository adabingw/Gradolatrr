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

    function changeInfo(event, infoname) {
        console.log(infoname);
        console.log(event.detail.data);
        let infostuff = courseinfo[infoname];
        courseinfo[event.detail.data] = infostuff;
        deleteTag(infoname);
        dispatch('info', {
            info: 'saved',
            new_info: infostuff, 
            info_name: event.detail.data
        });
    }

    function cancelInfo() {
        add = false;
    }

    function deleteTag(name) {
        console.log(name);
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
    <table>
    <div class="property-table">
    {#each Object.keys(courseinfo) as item}
        <tr>
        <!-- svelte-ignore empty-block -->
            <div class="type-block">
                <div class="type-block2" >
                    <td class="info-name">
                        <p class="tag-check">
                            {#if !courseinfo[item]["required"]}
                                <input type="checkbox"
                                    bind:checked={courseinfo[item]["checked"]} 
                                    on:change={() => {checkInfo(item)}}/>
                                <TextField bind:inputText={item} type="text" text={item} on:message={(e) => changeInfo(e, item)}
                                    min="" max=""  focus={true}/>
                            {:else}
                                <p  class="check-icon"></p>
                                {item}
                            {/if} 
                        </p>
                    </td>
                    <td><p class="info-type">{courseinfo[item]["type"]}</p></td>
                </div>
                <td class="info-icon">
                    {#if courseinfo[item]["type"] == "tags"}
                        <img src={Open} on:click={() => openModal(courseinfo[item], item)} alt="open" class="open-icon" />
                    {:else} 
                        <p  class="open-icon"></p>
                    {/if}
                </td>
                <td>
                    {#if !courseinfo[item]["required"]}
                        <img src={Close} on:click={() => deleteTag(item)}/>
                    {/if}
                </td>
            </div>
        </tr>
    {/each}
    </div>
    </table>
    {#if add}
    <div class="add-row">
        <TextField bind:inputText={info_name} type="text" text="" min="" max=""  focus={true}/>
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

.info-name {
    width: 350px;
}

.info-type {
    margin-left: 100px;
}

.info-icon {
    margin-left: 80px;
}

.type-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
}

.type-block2 {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 250px;
  height: 35px;
}

.tag-check {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 150px;
}

.open-icon {
  padding-left: 10px;
  padding-right: 10px;
}

.check-icon {
  padding-left: 18px;
  padding-right: 18px;
}

</style>

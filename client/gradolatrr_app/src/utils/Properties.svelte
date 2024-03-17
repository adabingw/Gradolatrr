<script>
    // @ts-nocheck
    // https://svelte.dev/examples/modal

    import { createEventDispatcher } from 'svelte';

    import Close from "../assets/delete_icon.png";
    import Open from "../assets/open_icon.png";
    import Button from './Button.svelte';
    import TextField from './TextField.svelte';
    import Dropdown from './Dropdown.svelte';
    import Modal from './Modal.svelte';
    import TagBlock from './TagBlock.svelte';
    import { TYPES } from '../constants/constants';

    export let courseinfo;

    let add = false;
    let info_name;
    let info_type;
    let showModal = false;
    let modalName = "";
    let properties = [];

    const dispatch = createEventDispatcher();

    function checkInfo(name) {
        dispatch('info', {
            info: 'checked'
        })
    }

    function addInfo() {
        add = !add;
    }

    function tagChange(event) {
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
        if (info_type == "multiselect" || info_type == "singleselect") new_info["tag_info"] = [];
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
        let infostuff = courseinfo[infoname];
        courseinfo[event.detail.data] = infostuff;
        deleteTag(infoname);
        dispatch('info', {
            info: 'saved',
            new_info: infostuff, 
            info_name: event.detail.data
        });
    }

    function changeType(event, infoname) {
        let old_type = courseinfo[infoname]["type"];
        courseinfo[infoname]["type"] = event.detail.data;
        courseinfo[infoname]["old_type"] = old_type;
        if (event.detail.data == "multiselect" || event.detail.data == "singleselect") {
            courseinfo[infoname]["tag_info"] = [];
        }
        
        dispatch('info', {
            info: 'type', 
            new_info: courseinfo[infoname],
            info_name: infoname
        })
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
    <table>
    <div class="property-table">
        <tr>
            <td class="tag-check">
                <p  class="check-icon"></p>
            </td>
            <td class="info-name">name</td>
            <td><p class="info-type">text</p></td>
        </tr>
        <tr>
            <td class="tag-check">
                <p  class="check-icon"></p>
            </td>
            <td class="info-name">mark</td>
            <td><p class="info-type">number</p></td>
        </tr>
    {#each Object.keys(courseinfo) as item}
    {#if item != "name" && item != "mark"}
        <tr>
            <td class="tag-check">
                <input type="checkbox"bind:checked={courseinfo[item]["checked"]} 
                    on:change={() => {checkInfo(item)}}/>
            </td>
            <td class="info-name">
                <TextField bind:inputText={item} type="text" text={item} on:message={(e) => changeInfo(e, item)}
                    min="" max=""  focus={true}/>
            </td>
            <td>
                <!-- <p class="info-type">{courseinfo[item]["type"]}</p> -->
            <div class="change-type">
                <Dropdown info={TYPES} selected={courseinfo[item]["type"]} 
                        on:message={(e) => changeType(e, item)}/>
            </div>
            </td>
            <td class="info-icon">
                {#if courseinfo[item]["type"] == "multiselect" || courseinfo[item]["type"] == "singleselect"}
                    <img src={Open} on:click={() => openModal(courseinfo[item], item)} alt="open" class="open-icon" />
                {:else} 
                    <p  class="open-icon"></p>
                {/if}
            </td>
            <td>
                <i class="fa-solid fa-xmark" on:click={() => deleteTag(item)}></i>
            </td>
        </tr>
    {/if}
    {/each}
    </div>
    </table>
    <div class="add-row">
        <Button text="+" on:message={addInfo} />
        {#if add}
        <div class="add-row">
            <TextField bind:inputText={info_name} text="name" type="text" max="" min="" focus={true} on:enter={saveInfo}/>
            <Dropdown info={TYPES} bind:selected={info_type}/>
        </div>
        <div class="save-div">
            <i class="fa-solid fa-check" on:click={() => saveInfo()}></i>
        </div>
        {/if}
    </div>
</div>

<style>
.add-row {
    display: flex; 
    align-items: center;
    vertical-align: middle;
    margin-left: 35px;
    margin-top: -10px;
}

.fa-solid {
    margin-right: 30px;
}

.info-name {
    margin-left: 15px;
    width: 200px;
}

.info-type {
    width: fit-content;
}

.info-icon {
    margin-left: 80px;
}

table {
    text-align: left;
}

.open-icon {
  padding-left: 10px;
  padding-right: 10px;
}

.check-icon {
  padding-left: 18px;
  padding-right: 18px;
}

input:checked {
    accent-color: #818181;
}

.save-div {
    display: flex;
    flex-direction: row;
    margin-left: 40px;
    align-content: center;
    align-items: center;
}

td {
    line-height: 0px;
}

i:hover {
    cursor:pointer;
}

</style>

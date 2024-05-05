<script>
    import { createEventDispatcher } from 'svelte';

    import Button from './Button.svelte';
    import TextField from './TextField.svelte';
    import Dropdown from './Dropdown.svelte';
    import { TYPES } from '../constants/constants';
    import Toasts from './Toasts.svelte';
    import { addToast } from "./store";

    export let content_info;

    let add = false;
    let info_name;
    let info_type;

    const dispatch = createEventDispatcher();

    function checkInfo(name) {
        dispatch('info', {
            info: 'checked'
        })
    }

    function addInfo() {
        add = !add;
    }

    function saveInfo() {
        if (info_name == undefined) {
            alert("Name is required");
            return;
        }

        for (let item of Object.keys(content_info)) {
            if (item == info_name) {
                alert("Name already exists");
                return;
            }
        }

        let new_info = {
            "checked": true, 
            "type": info_type, 
            "required": false,
            "order": 0
        }

        if (info_type == "multiselect" || info_type == "singleselect") {
            new_info["tag_info"] = []
        }

        content_info[info_name] = new_info;

        dispatch('info', {
            info: 'saved',
            new_info: new_info, 
            info_name: info_name
        });
        add = false;
        info_name = "";
    }

    function changeInfo(event, infoname) {
        let infostuff = content_info[infoname];
        const keys = Object.keys(content_info);
        let new_name = event.detail.data;
        let conflict = false;
        Object.keys(content_info).forEach((value, index) => {
            if (value == new_name) {
                new_name += "_";
                conflict = true;
            }
        })
        if (!new_name || !event.detail.data) {
            new_name = "_"
            addToast({ 
                message: 'name cannot be empty', 
                type: 'info', 
                dismissible: true, 
                timeout: 3000
            })
        }
        if (conflict) {
            addToast({ 
                message: 'conflicting property names', 
                type: 'info', 
                dismissible: true, 
                timeout: 3000
            })
        }
        
        const result = keys.reduce((acc, val) => {
            if (val == infoname) {

                val = new_name;
                acc[val] = infostuff;
            } else {
                acc[val] = content_info[val];
            }
            return acc;
        }, {});
        content_info = { ... result};
        dispatch('info', {
            info: 'update',
            old_name: infoname, 
            new_name: new_name
        });
    }

    function changeType(event, infoname) {
        let old_type = content_info[infoname]["type"];
        content_info[infoname]["type"] = event.detail.data;
        content_info[infoname]["old_type"] = old_type;
        if (event.detail.data == "multiselect" || event.detail.data == "singleselect") {
            content_info[infoname]["tag_info"] = [];
        }
        
        dispatch('info', {
            info: 'type', 
            new_info: content_info[infoname],
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

</script>

<Toasts />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
    <table>
    <div class="property-table">
        <tr>
            <td class="tag-check ">
                <p  class="check-icon"></p>
            </td>
            <td class="info-name th">property name</td>
            <td class="info-name th">type</td>
        </tr>
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
    {#each Object.keys(content_info) as item}
    {#if item != "name" && item != "mark"}
        <tr>
            <td class="tag-check">
                <input type="checkbox" bind:checked={content_info[item]["checked"]} 
                    on:change={() => {checkInfo(item)}}/>
            </td>
            <td class="info-name">
                <TextField bind:inputText={item} type="text" text={item} on:message={(e) => changeInfo(e, item)}
                    min="" max=""  focus={true}/>
            </td>
            <td>
            <div class="change-type">
                <Dropdown info={TYPES} selected={content_info[item]["type"]} on:message={(e) => changeType(e, item)}/>
            </div>
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
        <Button text="" icon="fa-solid fa-plus fa-xs" on:message={addInfo} />
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
    align-items: baseline;
    vertical-align: middle;
    margin-left: 35px;
}

.th {
    font-weight: 500;
    border-bottom: 1px solid #d1d1d1;
    padding-bottom: 18px;
}

.fa-solid {
    margin-right: 30px;
}

.info-name {
    margin-left: 15px;
    min-width: 25vw;
    width: fit-content;
}

.info-type {
    width: fit-content;
    min-width: 15vw;
}

table {
    text-align: left;
    width: 100%;
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

div {
    width: 100%;
}

</style>

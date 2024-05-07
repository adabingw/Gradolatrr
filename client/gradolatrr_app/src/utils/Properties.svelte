<script>
// @ts-nocheck

    import { createEventDispatcher } from 'svelte';

    import TextField from './TextField.svelte';
    import Dropdown from './Dropdown.svelte';
    import { TYPES, DROPDOWN } from '../constants/constants';
    import Toasts from './Toasts.svelte';
    import { addToast } from "./store";
    import NewProperty from './NewProperty.svelte';
    import { tooltip } from '@svelte-plugins/tooltips';

    export let content_info;
    let newproperty;

    const dispatch = createEventDispatcher();

    function checkInfo(name) {
        dispatch('info', {
            info: 'checked'
        })
    }

    function toggleRequired(name) {
        content_info[name]['required'] = !content_info[name]['required'];
        dispatch('info', {
            info: 'required'
        })
    }

    function saveInfo(event) {
        const info_name = event.detail.name;
        const info_type = event.detail.type;
        const visible = event.detail.visibility; 
        const required = event.detail.required;

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
            "checked": visible, 
            "type": info_type, 
            "required": required,
            "order": 0
        }

        if (info_type == "multiselect" || info_type == "singleselect") {
            new_info["tag_info"] = []
        }

        content_info[info_name] = new_info;

        dispatch('info', {
            info: 'saved',
            new_info: new_info, 
            info_name: info_name,
        });
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
<NewProperty types={TYPES} src="properties" bind:data={content_info} on:context={saveInfo} bind:this={newproperty}/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
    <table>
    <div class="property-table">
        <tr>
            <td class="tag-check ">
                <p  class="check-icon"></p>
            </td>
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
            <td class="tag-check ">
                <p  class="check-icon"></p>
            </td>
            <td class="info-name">name</td>
            <td><p class="info-type">text</p></td>
        </tr>
        <tr>
            <td class="tag-check">
                <p  class="check-icon"></p>
            </td>
            <td class="tag-check ">
                <p  class="check-icon"></p>
            </td>
            <td class="info-name">mark</td>
            <td><p class="info-type">number</p></td>
        </tr>
    {#each Object.keys(content_info) as item}
    {#if item != "name" && item != "mark"}
        <tr>
            <td class="tag-check"     
            use:tooltip={{
                content: 'show?',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}>
                <input type="checkbox" bind:checked={content_info[item]["checked"]} 
                    on:change={() => {checkInfo(item)}}/>
            </td>
            <td class={`${content_info[item]["required"] ? '' : 'not'}-required`}
                use:tooltip={{
                    content: 'required?',
                    style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                    position: 'top',
                    animation: 'slide',
                    arrow: false
                }}
            >
                <i class="fa-solid fa-exclamation" on:click={() => toggleRequired(item)}></i>
            </td>
            <td class="info-name">
                <TextField bind:inputText={item} type="text" text={item} on:message={(e) => changeInfo(e, item)}
                    min="" max=""  focus={true}/>
            </td>
            <td>
            <div class="change-type">
                <Dropdown info={DROPDOWN} selected={content_info[item]["type"]} on:message={(e) => changeType(e, item)}/>
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

    <i class="fa-solid fa-plus fa-xs" on:click={(e) => newproperty.openMenu(e)}></i>
</div>

<style>
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

td {
    line-height: 0px;
}

i:hover {
    cursor:pointer;
}

div {
    width: 100%;
}

.not-required {
    opacity: 0;
}

.not-required:hover {
    opacity: 1;
}

.required {
    opacity: 1;
}

</style>

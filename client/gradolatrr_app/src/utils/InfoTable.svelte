<script>
    import { Table, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";
    import { mutation } from "svelte-apollo";

    import { UPDATE_ASSIGNMENT, UPDATE_COURSE, UPDATE_TERM } from "../constants/queries_put";
    import { sortOrder, dragstart, dragover, drop, maxOrder } from "./utils.svelte";
    import TextArea from "./TextArea.svelte";
    import TextField from "./TextField.svelte";
    import Singleselect from "./deprecated/Singleselect.svelte";
    import Properties from "./Properties.svelte";
    import NewProperty from "./NewProperty.svelte";
    import Datepicker from "./Datepicker.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import Date from "./Date.svelte";
    import Context from "../assets/context_menu_icon.jpg";
    import Multiselect from "./Multiselect.svelte";

    export let cmd;
    export let info;

    let data = info["data"];
    data = JSON.parse(data);
        
    let content_info;
    if (cmd == "course") {
        content_info = JSON.parse(info["content_info"]);
    }

    let data_array = [];
    for (const key in data) {
        data_array.push([ key, data[key] ])
    }
    // data_array = sortOrder(data_array);

    let showMenu = false;
    let context_bundle = [ 0, 0, 0 ];
    let update;

    if (cmd == "term") update = mutation(UPDATE_TERM);
    else if (cmd == "course") update = mutation(UPDATE_COURSE);
    else if (cmd == "assign") update = mutation(UPDATE_ASSIGNMENT);

    const dispatch = createEventDispatcher();

    // async function dropEvent(ev, key2, index2) {
    //     let return_info = drop(ev, key2, index2, data_array, info);
    //     info = return_info[0];
    //     data_array = return_info[1];
    //     data_array = sortOrder(data_array);

    //     if (cmd == "term") {
    //         try {
    //             await update({
    //                 variables: {
    //                     input: {
    //                         id: info["id"], 
    //                         type: cmd, 
    //                         data: info["data"]
    //                     }
    //                 }
    //             });
    //         } catch(error) {
    //             console.error(error);
    //         }
    //     } else if (cmd == "course") {
    //         try {
    //             await update({
    //                 variables: {
    //                     input: {
    //                         id: info["id"], 
    //                         type: "course", 
    //                         data: info["data"]
    //                     }
    //                 }
    //             });
    //         } catch(error) {
    //             console.error(error);
    //         }
    //     } else if (cmd == "assign") {
    //         try {
    //             await update({
    //                 variables: {
    //                     input: {
    //                         id: info["id"], 
    //                         type: "item", 
    //                         data: info["data"]
    //                     }
    //                 }
    //             });
    //         } catch(error) {
    //             console.error(error);
    //         }
    //     }
    // }

    function infoController(event) {
        if (event.detail.info == "delete") {            
            delete content_info[event.detail.data]
            dispatch('action', {
                action: 'delete',
                info_name: event.detail.data, 
            })
        } else if (event.detail.info == "saved") {
            content_info[event.detail.info_name] = event.detail.new_info;
            dispatch('action', {
                'action': 'saved',
                info_name: event.detail.info_name, 
                new_info: event.detail.new_info['type']
            })
        } else if (event.detail.info == "tags") {
            content_info[event.detail.info_name] = event.detail.tags;
        } else if (event.detail.info == "type") {
            content_info[event.detail.info_name] = event.detail.new_info;
        }
        info["content_info"] = JSON.stringify(content_info);
        content_info = content_info;
    }

    function addedProperty(event) {
        const new_name = event.detail.name;
        const new_type = event.detail.type; 
        
        let new_property = {
            "type": new_type, 
            "order": (cmd == "assign" || cmd == "bundle") ? 1 : maxOrder(data_array) + 1
        }

        if (new_type == "text" || new_type == "textarea") new_property["content"] = "";
        else if (new_type == "number") new_property["content"] = 0;
        else if (new_type == "multiselect" || new_type == "singleselect") new_property["content"] = [["", 0]];

        data_array.push([new_name, new_property]);
        data[new_name] = new_property;
        info["data"] = JSON.stringify(data);
        data_array = data_array;
        let data_temp = JSON.stringify(data);
        dispatch('message', {
            data: data_temp
        });
    }

    function dataChange() {
        for (const key of data_array) {
            data[key[0]] = key[1];
        }
        let data_temp = JSON.stringify(data);
        dispatch('message', {
            data: data_temp
        });
    }

    function dataChangeSelect(event, key) {
        dispatch('message', {
            data: data, 
            key: key
        });
    }

    function openMenu(e, index, item) {
        showMenu = false;
        e.preventDefault();
        context_bundle = [e.clientX, e.clientY, index, item];
        showMenu = true;
    }

    function contextController(e) {
        const index = e.detail.index;
        const item = e.detail.item;
        data_array.splice(index, 1);
        delete data[item];
        info["data"] = JSON.stringify(data);
        data_array = data_array;
    }

    function updateInfo() {     
        if (typeof info["data"] != 'object') data = JSON.parse(info["data"]);
        if (data_array.length != 0) data_array = [];
        for (const key in data) {
            data_array.push([ key, data[key] ])
        }
        // data_array = sortOrder(data_array);
    }

    $: {
        info;
        updateInfo();
    }

</script>

<div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" 
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" 
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</div>

<ContextMenu bind:showMenu={showMenu} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        bind:item={context_bundle[3]}
        menuNum={1}
        on:context={contextController}/>
<table class="Table">
<div class="Table">
    <tbody>
        {#if data_array.length > 0 && data_array != undefined}
            {#each data_array as data, i}
            {#if data[0] != "name"}
                <tr>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="TableBodyRow" >
                    <!-- draggable={true}
                    on:dragstart={event => dragstart(event, data[0] , i)}
                    on:drop={event => dropEvent(event, data[0], i)} on:dragover={dragover}> -->
                    {#if cmd != "assign" && cmd != "bundle"}
                    {/if}
                    <td>
                        <span class="bodycellheader tablecol">
                            <i class="fa-solid fa-ellipsis-vertical context_menu" 
                            on:click={(e) => openMenu(e, i, data[0])} on:contextmenu={(e) => openMenu(e, i, data[0])}></i>
                            <p>{data[0]}</p>
                        </span>
                    </td>
                </div>
                </tr>
                <tr>
                    <div class="TableBodyRow TableBodyText">
                        <td>
                            {#if data[1]["type"] == "textarea"}
                                <TextArea bind:inputText={data[1]["content"]} on:message={dataChange}/>
                            {:else if data[1]["type"] == "text" || data[1]["type"] == "number"}
                                <TextField bind:inputText={data[1]["content"]} 
                                    text="nothing here yet..." type={data[1]["type"]} on:message={dataChange}
                                    max={100} min={0}  focus={false}/>
                            {:else if data[1]["type"] == "multiselect" && (cmd == "assign" || cmd == "bundle")}
                                <Multiselect bind:properties={data[1]["content"]} bind:selections={data[1]["tag_info"]}
                                    on:assign={(e) => dataChangeSelect(e, data[0])} on:course={(e) => dataChangeSelect(e, data[0])} max=0/>
                            {:else if data[1]["type"] == "singleselect" && (cmd == "assign" || cmd == "bundle")}
                                <Multiselect bind:properties={data[1]["content"]} bind:selections={data[1]["tag_info"]}
                                on:assign={(e) => dataChangeSelect(e, data[0])} on:course={(e) => dataChangeSelect(e, data[0])} max=1/>
                            {:else if data[1]["type"] == "date"}
                                <Date bind:date={data[1]["content"]} on:message={dataChange} />
                            {:else if data[1]["type"] == "date" && cmd == "bundle"}
                                <Datepicker bind:dates={data[1]["content"]} bind:num={data[1]["num"]} on:message={dataChange}/>
                            {/if}
                        </td>
                    </div>
                </tr>
            {/if} 
            {/each} 
        {/if}
        </tbody>
</div>
</table>
{#if cmd != "assign" && cmd != "bundle"}
    <NewProperty on:message={addedProperty} data={data_array}/>
{/if}
{#if cmd == "course"}
    <p class="subheader">Information about items in this course</p>
    <Properties bind:courseinfo={content_info} on:info={infoController}/>
{/if}

<style>
.context_menu {
    margin-left: -15px;
    opacity: 0;
}

.context_menu:hover {
    opacity: 1;
}

.subheader {
    width: 60vw;
    font-size: 20px;
    font-weight: 600;
    color: #818181;
    border-bottom: 1px solid #d1d1d1;
    padding-bottom: 5px;
}

.tablecol {
    width: 100%;
}

.TableBodyRow {
    display: flex; 
    align-items: center;
    width: 100%;
}

.bodycellheader {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    min-width: fit-content;
}

.TableBodyText {
    margin-top: -15px;
    width:100%;
}

.TableBodyRow:hover {
    cursor: pointer;
}

.Table {
    width:100%;
}

table, tbody, tr, td, .TableBodyRow {
    /* min-width: 100%; */
    width: 60vw;
}
</style>

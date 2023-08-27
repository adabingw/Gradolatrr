<script>
    import { Table, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";

    import { sortOrder, dragstart, dragover, drop, maxOrder } from "./utils.svelte";
    import TextArea from "./TextArea.svelte";
    import TextField from "./TextField.svelte";
    import TagBlock from "./TagBlock.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Properties from "./Properties.svelte";
    import NewProperty from "./NewProperty.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import Context from "../assets/context_menu_icon.jpg";
    import Close from "../assets/delete_icon.png";

    export let cmd;
    export let info;

    let data = info["data"];
    data = JSON.parse(data);
        
    let content_info;
    console.log(cmd)
    if (cmd == "course") {
        content_info = JSON.parse(info["content_info"]);
        console.log(content_info);
    }

    let data_array = [];
    for (const key in data) {
        data_array.push([ key, data[key] ])
    }
    data_array = sortOrder(data_array);

    let showMenu = false;
    let context_bundle = [ 0, 0, 0 ];

    function dropEvent(ev, key2, index2) {
        var key = ev.dataTransfer.getData("key");
        var index = ev.dataTransfer.getData("index");
        let return_info = drop(ev, key2, index2, data_array, info);
        data_array[index][1]["order"] = return_info[0];
        data[key]["order"] = return_info[0];
        info = return_info[1];
        data_array = return_info[2];
    }

    function infoController(event) {
        if (event.detail.info == "delete") {
            delete content_info[event.detail.data]
        } else if (event.detail.info == "saved") {
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
        else if (new_type == "tags") new_property["content"] = [["", 0]];

        data_array.push([new_name, new_property]);
        data[new_name] = new_property;
        info["data"] = JSON.stringify(data);
        data_array = data_array;
    }

    function dataChange() {
        console.log("data changed");
        console.log(data_array);
        for (const key of data_array) {
            data[key[0]] = key[1];
        }
        info["data"] = JSON.stringify(data);
    }

    // only for content_info / courses
    function addedTag(event, attribute_name) {
        const tag = event.detail.tag;
        const colour = event.detail.colour;
        for (let i = 0; i < data_array.length; i++) {
            if (data_array[i][0] == attribute_name) {
                if (data_array[i][1]["content"].includes(tag)) {
                    console.log("has tag already");
                }
                data_array[i][1]["content"].push([tag, `#${colour}`]);
                data_array[i][1]["content"].pop();
                data_array = data_array;
                break;
            }
        }
        data[attribute_name]["content"].push([tag, `#${colour}`])
        info["data"] = JSON.stringify(data);
    }

    function openMenu(e, index) {
        e.preventDefault();
        context_bundle = [e.clientX, e.clientY, index]
        showMenu = true;
    }

    function contextController(e) {
        const context = e.detail.context; 
        const index = e.detail.index;
        // lol need to do this
        console.log("context is: ", context)
        console.log("index is: ", index);
    }

</script>

<ContextMenu bind:showMenu={showMenu} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        on:context={contextController}/>
<Table>
    {#if data_array.length > 0 && data_array != undefined}
        <TableBody>
        {#each data_array as data, i}
            <TableBodyRow>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="TableBodyRow" draggable={(cmd == "assign" || cmd == "bundle") ? false : true}
                on:dragstart={event => dragstart(event, data[0] , i)}
                on:drop={event => dropEvent(event, data[0], i)} on:dragover={dragover}>
                {#if cmd != "assign" && cmd != "bundle"}
                    <TableBodyCell>
                        <img src={Context} on:contextmenu={(e) => openMenu(e, i)} alt="context menu"/>
                    </TableBodyCell>
                {/if}
                <TableBodyCell class="term-header tablecol">{data[0]}</TableBodyCell>
                <TableBodyCell>
                    {#if data[1]["type"] == "textarea"}
                        <TextArea bind:inputText={data[1]["content"]} on:message={dataChange}/>
                    {:else if data[1]["type"] == "tags" && cmd == "course"}
                        <TagBlock bind:properties={data[1]["content"]} on:message={(event) => addedTag(event, data[0])}/>
                    {:else if data[1]["type"] == "text" || data[1]["type"] == "number"}
                        <TextField bind:inputText={data[1]["content"]} text={data[1]["content"]} type={data[1]["type"]} on:message={dataChange}/>
                    {:else if data[1]["type"] == "tags" && (cmd == "assign" || cmd == "bundle")}
                        {data[1]["addition"]}
                        <!-- <Dropdown bind:info={data[1]["addition"]} 
                            bind:selected={data[1]["content"][0]} /> -->
                    {/if}
                </TableBodyCell>

            </div>
            </TableBodyRow>
        {/each}
        {#if cmd == "course" && content_info != undefined && content_info.length != 0}
            <TableBodyRow>
                <div class="TableBodyRow" >
                <TableBodyCell class="term-header tablecol">item info</TableBodyCell>
                <TableBodyCell>
                    <Properties bind:courseinfo={content_info} on:info={infoController}/>
                </TableBodyCell>
                <TableBodyCell>
                    <img src={Close} class="close" alt="close"/>
                </TableBodyCell>
                </div>
            </TableBodyRow>
        {/if}
        </TableBody> 
    {/if} 
</Table>
{#if cmd != "assign" && cmd != "bundle"}
    <NewProperty on:message={addedProperty} />
{/if}

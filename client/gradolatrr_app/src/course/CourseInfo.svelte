<script>
// @ts-nocheck

    export let id;
    export let name;

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    import { tick } from 'svelte'

    import Context from '../assets/context_menu_icon.jpg';
    import TextArea from '../utils/TextArea.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Properties from '../utils/Properties.svelte';
    import TagBlock from '../utils/TagBlock.svelte';
    import Button from '../utils/Button.svelte';
    import ContextMenu from '../utils/ContextMenu.svelte';
    import { sortOrder, dragover, dragstart } from '../utils/utils.svelte';
    
    // get info from id
    let term_info = {
        "ECON101": {
            metadata: {
                type: "course",
                id: "abcde",
                term_id: "abcde",
                term_name: "ECON101",
            },
            description: {
                type: "textbox",
                content: "hello", 
                order: 5
            }, 
            resource: {
                type: "textbox",
                content: "resource",
                order: 1
            },
            tags: {
                type: "tags",
                content: ['assignment', 'final', 'midterm'],
                order: 2
            },
            content_info: {
                type: "desc",
                "name": {
                    checked: true, 
                    type: "number", 
                    required: true,
                    order: 0
                },
                "mark": {
                    checked: true, 
                    type: "number", 
                    required: false,
                    order: 1
                },
                "weight": {
                    checked: true, 
                    type: "number",
                    required: false,
                    order: 2
                },
                "tags": {
                    checked: true, 
                    type: "tags",
                    required: false,
                    order: 3
                },
                "description": {
                    checked: false, 
                    type: "textarea",
                    required: false,
                    order: 4
                }
            }
        }
    }

    let info = term_info[name]
    let changed;
    let showMenu = false;
    let clickx = 0;
    let clicky = 0;

    function addProperty() {
        console.log("add properties")
    }

    function saveChanges() {
        console.log("save changes")
    }

    function messageController(event) {
        const message = event.detail.TextArea; 
        switch(message) {
            case "change":
                break;
            case "delete":
                break;
            default:
                break;
        }
        term_info[name] = info;
    }

    let content_array = []

    for (const key in info) {
        if (key == "metadata" || key == "content_info") continue; 
        content_array.push([ key, info[key] ])
    }

    content_array = sortOrder(content_array);

	function drop (ev, key2, index2) {
		ev.preventDefault();
		var key = ev.dataTransfer.getData("key");
        if (key2 == key) return;

        var index = ev.dataTransfer.getData("index");
        var order = content_array[index][1]["order"];
        var order2 = content_array[index2][1]["order"];
        order = order2 + 1;
        
        let orders = [order];
        for (const [i, value] of Object.entries(info)) {
            if (i == "metadata" || i == "content_info") continue;
            if (i == key) continue;
            console.log(i)
            const o = info[i]["order"]
            if (orders.includes(o)) {
                orders.push(o + 1);
                info[i]["order"]++;
            } else {
                orders.push(o);
            }
        }
        content_array[index][1]["order"] = order;
        info[key]["order"] = order;
        term_info[name] = info;
        content_array = sortOrder(content_array);
	}

    let menu = { h: 0, w: 0 }
    let browser = { h: 0, w: 0 }
    export let menuItems;
    export let pos = { x: 0, y: 0 }
    export let x;
    export let y;
    
    export function openMenu(e) {
        if (showMenu) {
            showMenu = false;
            return;
        }

        showMenu = true;
        pos = {
            x: e.clientX, y: e.clientY
        }
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };

        if (browser.h -  pos.y < menu.h)
            pos.y = pos.y - menu.h
        if (browser.w -  pos.x < menu.w)
            pos.x = pos.x - menu.w
        console.log("opening menu")
        
    }
    
    function getContextMenuDimension(node){
        let height = node.offsetHeight
        let width = node.offsetWidth
        menu = {
            h: height,
            w: width
        }
    }

    function menuClick() {
        console.log("yeah")
    }

    function onPageClick() {
        showMenu = false;
    }

    menuItems = [
        {
            'name': 'trash',
            'onClick': menuClick,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can'
        },
    ]

</script>

<div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" 
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" 
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</div>
<div>
    <p>
        {name}
    </p>
    <Table class="coursetable">
    {#if content_array != undefined}
        <TableBody>
        {#each Object.keys(content_array) as i}
            <TableBodyRow>
            {#if i != "metadata"}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="TableBodyRow" draggable={true} 
                on:dragstart={event => dragstart(event, content_array[i][0] , i)}
                on:drop={event => drop(event, content_array[i][0], i)} on:dragover={dragover}>
                <TableBodyCell>
                    <img src={Context} class="context" on:click={(e) => openMenu(e)}
                    on:contextmenu|preventDefault={(e) => openMenu(e)}/>
                </TableBodyCell>
                <TableBodyCell class="term-header tablecol">{content_array[i][0]}</TableBodyCell>
                <TableBodyCell>
                {#each Object.keys(content_array[i][1]) as j}
                    {#if j == "type"}
                        <p></p>
                    {:else if j == "content"}
                        <!-- svelte-ignore empty-block -->
                        {#if content_array[i][1]["type"] == "textbox"}
                            <TextArea bind:inputText={content_array[i][1][j]}
                                      bind:changed={changed} />
                        {:else if content_array[i][1]["type"] == "tags"}
                            <TagBlock bind:properties={content_array[i][1][j]} />
                        {/if}
                    {/if}
                {/each}
                {#if content_array[i][1]["type"] == "desc"}
                    <Properties bind:courseinfo={info[i]} on:message={messageController}/>
                {/if}
                </TableBodyCell>
            </div>
            {/if}
            </TableBodyRow>
        {/each}
        </TableBody>
    {/if} 
    </Table>
    <Button text="+add properties" on:click={addProperty} />
    <div class="term-op">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>

{#if showMenu}
<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px" >
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItems as item}
                {#if item.name == "hr"}
                    <hr>
                {:else}
                    <li><button on:click={item.onClick}><i class={item.class}></i>{item.displayText}</button></li>
                {/if}
            {/each}
        </ul>
    </div>
</nav>
{/if}

<style>
* {
    padding: 0;
    margin: 0;
}
.navbar{
    display: inline-flex;
    border: 1px #999 solid;
    width: 170px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    flex-direction: column;
}
.navbar ul{
    margin: 6px;
}
ul li{
    display: block;
    list-style-type: none;
    width: 1fr;
}
ul li button{
    font-size: 1rem;
    color: #222;
    width: 100%;
    height: 30px;
    text-align: left;
    border: 0px;
    background-color: #fff;
}
ul li button:hover{
    color: #000;
    text-align: left;
    border-radius: 5px;
    background-color: #eee;
}
ul li button i{
    padding: 0px 15px 0px 10px;
}
ul li button i.fa-square{
    color: #fff;
}
ul li button:hover > i.fa-square{
    color: #eee;
}
ul li button:hover > i.warning{
    color: crimson;
}
:global(ul li button.info:hover){
    color: navy;
}
hr{
    border: none;
    border-bottom: 1px solid #ccc;
    margin: 5px 0px;
}
</style>

<svelte:window on:contextmenu|preventDefault
on:click={onPageClick} />

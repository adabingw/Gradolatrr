<script>
    import { createEventDispatcher, onMount } from 'svelte';

    export let x;
    export let y;
    export let showMenu = false;
    export let index;
    export let item;
    export let menuNum;

    let menuItem;
    let menuItems1 = [
        {
            'name': 'trash',
            'onClick': menuClick,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can fa-ms'
        }, 
        {
            'name': 'change_type', 
            'onClick': undefined,
            'displayText': 'Change type', 
            'class': 'fa-solid fa-sliders fa-ms', 
            'subClasses': [{
                'name': 'text', 
                'onClick': menuClick,
                'displayText': 'Text', 
                'class': '', 
            }, {
                'name': 'number', 
                'onClick': menuClick,
                'displayText': 'Number', 
                'class': ''
            }, {
                'name': 'textarea', 
                'onClick': menuClick,
                'displayText': 'Textarea', 
                'class': ''
            }, {
                'name': 'date', 
                'onClick': menuClick,
                'displayText': 'Date', 
                'class': ''
            }
            ]
        }
    ]

    let menuItems2 = [
        {
            'name': 'trash',
            'onClick': menuClick,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can fa-ms',
            'disable': false
        }, {
            'name': 'edit',
            'onClick': menuClick,
            'displayText': "Edit",
            'class': 'fa-solid fa-pen fa-ms',
            'disable': false
        }, {
            'name': 'duplicate',
            'onClick': menuClick,
            'displayText': "Copy",
            'class': 'fa-solid fa-copy fa-ms',
            'disable': true
        }
    ]

    let menuItems3 = [
        {
            'name': 'trash',
            'onClick': menuClick,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can fa-ms'
        }, {
            'name': 'duplicate',
            'onClick': menuClick,
            'displayText': "Copy",
            'class': 'fa-solid fa-copy fa-ms'
        }
    ]

    let menuItems4 = [
        {
            'name': 'trash',
            'onClick': menuClick,
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can fa-ms'
        }, {
            'name': 'edit',
            'onClick': menuClick,
            'displayText': "Edit",
            'class': 'fa-solid fa-pen fa-ms'
        }
    ]

    const dispatch = createEventDispatcher();

    function menuClick(context, subcontext) {
        showMenu = false; 
        dispatch('context', {
            context: context,
            subcontext: subcontext,
            index: index, 
            item: item
        })
    }

    function onPageClick(e) {
        showMenu = false;
    }

    onMount(() => {
        if (menuNum == 1) menuItem = menuItems1;
        else if (menuNum == 2) menuItem = menuItems2;
        else if (menuNum == 3) menuItem = menuItems3;
        else menuItem = menuItems4;
    });

</script>

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
    border-radius: 3px;
    overflow: hidden;
    flex-direction: column;
}

.navbar ul{
    margin: 6px;
}

button:disabled,
button[disabled]{
  color: #919191;
}

button:disabled:hover,
button[disabled]:hover{
  background-color: white !important;
  cursor: not-allowed;
}

#disabled:hover {
    cursor: not-allowed;
}

ul li{
    display: block;
    list-style-type: none;
    width: 1fr;
}

ul li button {
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

.subclass {
    color: #818181;
    padding-left: 15px;
}
</style>

{#if showMenu}
<div style="position: absolute; top:{y}px; left:{x}px; z-index: 1;" class:show={showMenu}>
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItem as item}
                {#if item.name == "hr"}
                    <hr>
                {:else}
                    <li>
                        {#if item.onClick == undefined} 
                            <button> 
                                <i class={item.class}></i>
                                {item.displayText}
                            </button>
                        {:else}
                            <button on:click={() => item.onClick(item.name, undefined)} disabled={item.disable == true}> 
                                <i class={`${item.class}`} id={item.disable ? "disabled" : ""}></i>
                                {item.displayText}
                            </button>
                        {/if}
                    </li>
                    {#if item.subClasses}
                    {#each item.subClasses as subClasses}
                        <li class="subclass">
                            <button on:click={() => subClasses.onClick(item.name, subClasses.name)} class="subclass"> 
                                {subClasses.displayText}
                            </button>
                        </li>
                    {/each}
                    {/if}
                {/if}
            {/each}
        </ul>
    </div>
</div>
{/if}

<svelte:window on:click={(e) => onPageClick(e)} />


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
            'name': 'change type', 
            'onClick': undefined,
            'displayText': 'Change type', 
            'class': 'fa-solid fa-sliders fa-ms', 
            'subClasses': [{
                'name': 'Text', 
                'onClick': menuClick,
                'displayText': 'Text', 
                'class': '', 
            }, {
                'name': 'Number', 
                'onClick': menuClick,
                'displayText': 'Number', 
                'class': ''
            }, {
                'name': 'Textarea', 
                'onClick': menuClick,
                'displayText': 'Textarea', 
                'class': ''
            }, {
                'name': 'Date', 
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
            'class': 'fa-solid fa-trash-can fa-ms'
        }, {
            'name': 'edit',
            'onClick': menuClick,
            'displayText': "Edit",
            'class': 'fa-solid fa-pen fa-ms'
        }, {
            'name': 'duplicate',
            'onClick': menuClick,
            'displayText': "Copy",
            'class': 'fa-solid fa-copy fa-ms'
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

    function menuClick(context) {
        console.log("menu clicked")
        showMenu = false; 
        dispatch('context', {
            context: context,
            index: index, 
            item: item
        })
    }

    function onPageClick(e) {
        let x_1 = e.clientX;
        let y_1 = e.clientY;
        console.log(x_1, y_1, x, y)
        if (Math.abs(x_1 - x) > 30 || Math.abs(y_1 - y) > 200) {
            showMenu = false;
        }
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
<div style="position: absolute; top:{y}px; left:{x}px" class:show={showMenu}>
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
                            <button on:click={() => item.onClick(item.name)}> 
                                <i class={item.class}></i>
                                {item.displayText}
                            </button>
                        {/if}
                    </li>
                    {#if item.subClasses}
                    {#each item.subClasses as subClasses}
                        <li class="subclass">
                            <button on:click={() => item.onClick(item.name)} class="subclass"> 
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


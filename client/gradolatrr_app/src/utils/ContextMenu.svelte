<script context="module">
    let menu = { h: 0, w: 0 }
    let browser = { h: 0, w: 0 }
    export let menuItems;
    export let showMenu = false;
    export let pos = { x: 0, y: 0 }
    export let x;
    export let y;
    
    export function openMenu() {
        pos = {
            x: x, y: y
        }
        // showMenu = true;
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

    menuItems = [
        {
            'name': 'addItem',
            'onClick': menuClick,
            'displayText': "Add Item",
            'class': 'fa-solid fa-plus'
        },
        {
            'name': 'emptyicons',
            'onClick': menuClick,
            'displayText': "Empty Icon",
            'class': 'fa-solid fa-square'
        },
        {
            'name': 'zoom',
            'onClick': menuClick,
            'displayText': "Zoom",
            'class': 'fa-solid fa-magnifying-glass'
        },
        {
            'name': 'printMenu',
            'onClick': menuClick,
            'displayText': "Print",
            'class': 'fa-solid fa-print'
        },
        {
            'name': 'hr',
        },
        {
            'name': 'settings',
            'onClick': menuClick,
            'displayText': "Settings",
            'class': 'fa-solid fa-gear'
        },
        {
            'name': 'hr',
        },
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

{#if showMenu}
<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px" on:show={openMenu()}>
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

<!-- <svelte:window on:click={onPageClick} /> -->


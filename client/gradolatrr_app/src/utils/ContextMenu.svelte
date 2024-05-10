<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { clickOutside } from './utils';
    import { MENUITEMS1, MENUITEMS2, MENUITEMS3, MENUITEMS4, MENUITEMS5, MENUITEMS6 } from '../constants/constants.js';

    let x;
    let y;
    let showMenu = false;
    let index;
    let item = [];
    export let menuNum;

    let style = "";

    let menuItem;
    let selectedItem = '';

    const dispatch = createEventDispatcher();

    function menuClick(context, subcontext) {
        if (menuNum == 6) return;
        showMenu = false; 
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'auto';
        dispatch('context', {
            context: context,
            subcontext: subcontext,
            index: index, 
            item: item
        })
    }

    function onPageClick(e) {
        showMenu = false;
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'auto';
        if (menuNum == 6) {
            dispatch('context', {
                index: index, 
                item: item,
                context: selectedItem
            })
        }
    }

    onMount(() => {
        if (menuNum == 1) menuItem = MENUITEMS1;
        else if (menuNum == 2) menuItem = MENUITEMS2;
        else if (menuNum == 3) menuItem = MENUITEMS3;
        else if (menuNum == 5) menuItem = MENUITEMS5;
        else if (menuNum == 6) menuItem = MENUITEMS6;
        else menuItem = MENUITEMS4;
    });

    export function openMenu(e, item2, index2) {
        showMenu = false;
        e.preventDefault();
        e.stopPropagation(); 
        x = e.clientX;
        y = e.clientY;
        index = index2;
        item = item2;
        for (let k of Object.keys(item2)) {
            if (selectedItem == '') selectedItem = k;
        }
        showMenu = true;
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'hidden';
    }

    $: {
        y, x;
        if (y > window.innerHeight - 200 && x > window.innerWidth - 200) {
            style = `position: absolute; bottom:${window.innerHeight - y}px; right:${window.innerWidth - x}px; z-index: 1;`
        } else if (y > window.innerHeight - 200 && x <= window.innerWidth - 200) {
            style = `position: absolute; bottom:${window.innerHeight - y}px; right:${x}px; z-index: 1;`
        } if (y <= window.innerHeight - 200 && x > window.innerWidth - 200) {
            style = `position: absolute; bottom:${y}px; right:${window.innerWidth - x}px; z-index: 1;`
        } else {
            style = `position: absolute; top:${y}px; left:${x}px; z-index: 1;`
        }
    }

</script>

{#if showMenu}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->  
<div style={style} class:show={showMenu} use:clickOutside on:click_outside={onPageClick}>
    <div class={`navbar`} id="navbar">
        <ul>
            {#if menuNum == 6}
            <div class="sort_key">
                Sort by
                {#each item as i, i2}
                <li on:click={() => {
                    index[0] = i[0];
                    selectedItem = i[0];
                }}>
                    <button class={`sort_item ${index[0] == i[0] ? 'selected' : ''}`}> 
                        {i[0]}
                    </button>
                </li>
                {/each}
            </div>
            {/if}            
            {#each menuItem as mitem, i}
                    <li>
                        {#if mitem.subClasses != undefined} 
                            <button> 
                                <i class={mitem.class}></i>
                                {mitem.displayText}
                            </button>
                        {:else}
                            <button class={`menu-${menuNum} ${(menuNum == 6 && index[0] != 0 && index[1] == i) ? 'selected' : ''}`}
                                on:click={() => {
                                    index[1] = i;
                                    menuClick(mitem.name, undefined);
                                }} disabled={mitem.disable == true}> 
                            {#if menuNum == 5 && index == i}
                                <i class="fa-solid fa-check"></i>
                            {/if}
                                <i class={`${mitem.class}`} id={mitem.disable ? "disabled" : ""}></i>
                                {mitem.displayText}
                            </button>
                        {/if}
                    </li>
                    {#if mitem.subClasses}
                    {#each mitem.subClasses as subClasses}
                        <li class="subclass">
                            <button on:click={() => menuClick(mitem.name, subClasses.name)} class="subclass"> 
                                {subClasses.displayText}
                            </button>
                        </li>
                    {/each}
                    {/if}
            {/each}
            {#if menuNum == 6}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="filter_action trash" on:click={(e) => {
                    selectedItem = undefined;
                    onPageClick(e)
                }}>
                    <i class="fa-solid fa-trash"></i> delete sort
                </div>
            {/if}
        </ul>
    </div>
</div>
{/if}

<style>
* {
    padding: 0;
    margin: 0;
}

.trash {
    margin-top: 15px;
    padding-top: 8px;
    color: #717171;
    border-top: 1px solid #d1d1d1;
    margin-bottom: 8px;
}

.trash:hover {
    cursor: pointer;
}

.sort_item {
    padding-left: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.sort_key {
    border-bottom: 1px solid #d1d1d1;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.selected {
    color: #000;
    text-align: left;
    border-radius: 5px;
    background-color: #eee;
}

.navbar{
    display: inline-flex;
    border: 1px #999 solid;
    width: fit-content;
    background-color: #fff;
    border-radius: 5px;
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

ul li {
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
    padding-right: 8px;
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

.menu-5 {
    text-align: right;
}

.menu-5:hover {
    text-align: right;
}

.subclass {
    color: #818181;
    padding-left: 15px;
}
</style>

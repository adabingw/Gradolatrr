<script>
    import { createEventDispatcher } from 'svelte';
    import { clickOutside } from './utils';

    export let data;
    export let x;
    export let y;
    export let showMenu = false;
    export let types;
    export let src;

    let style = "";
    let name; 
    let type = 'text';
    let visible = true;
    let required = false;

    const dispatch = createEventDispatcher();

    function saveProperty() {
        if (name == undefined) {
            alert("Name is required");
            return;
        }

        for (let d of Object.keys(data)) {
            if (d == name) {
                alert("Name already exists");
                return;
            }
        }

        dispatch('context', {
            name: name, 
            type: type,
            visibility: visible,
            required: required
        });
        showMenu = false;
    }

    function onPageClick(e) {
        showMenu = false;
    }

    export function openMenu(e) {
        showMenu = false;
        e.preventDefault();
        x = e.clientX;
        y = e.clientY;
        showMenu = true;
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'hidden';
    }

    $: {
        y, x;
        if (src == 'properties') {
            if (y > window.innerHeight - 500 && x > window.innerWidth - 700) {
                style = `position: absolute; bottom:${window.innerHeight - y}px; left:${x}px; z-index: 1;`
            } else if (y > window.innerHeight - 500 && x <= window.innerWidth - 500) {
                style = `position: absolute; bottom:${window.innerHeight - y}px; right:${window.innerWidth - x}px; z-index: 1;`
            } else if (y <= window.innerHeight - 500 && x > window.innerWidth - 500) {
                style = `position: absolute; bottom:${y}px; right:${window.innerWidth - x}px; z-index: 1;`
            } else {
                style = `position: absolute; top:${y}px; left:${x}px; z-index: 1;`
            }
        } else {
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
    }
</script>

{#if showMenu}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style={style} class:show={showMenu} use:clickOutside on:click_outside={onPageClick}>
    <div class={`navbar`} id="navbar">
        <ul>
            <input type="text" placeholder="Name" bind:value={name} />
            {#each Object.keys(types) as t, i}
            <div class={`type ${type == t ? 'selected' : ''}`} on:click={() => type = t }>
                <i class={types[t]} />
                {t}
            </div>
            {/each}
            <div class="eye">
                {#if src == 'properties'}
                    <div class="property_action" on:click={(e) => {
                        visible = !visible; 
                    }}>
                        <i class={`fa-solid ${visible ? 'fa-eye' : 'fa-eye-slash'}`}></i> 
                        <span>{visible ? 'show' : 'hide'}</span>
                    </div>
                    <div class="action" on:click={(e) => required = !required}>
                        <i class="fa-solid fa-asterisk"></i>
                        <span>{required ? 'required' : 'not required'}</span>
                    </div>
                {/if}
                <div class="action" on:click={saveProperty}>
                    <i class="fa-solid fa-floppy-disk"></i> save
                </div>
                <div class="action" on:click={onPageClick}>
                    <i class="fa-solid fa-trash"></i><span class="trash">delete</span>
                </div>
            </div>
        </ul>
    </div>
</div>
{/if}

<style>
* {
    padding: 0;
    margin: 0;
}

.navbar {
    display: inline-flex;
    border: 1px #999 solid;
    width: fit-content;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    flex-direction: column;
    padding: 12px;
    width: fit-content;
}

.type {
    padding-top: 7px;
    padding-bottom: 7px;
}

.type:hover {
    background-color: #eee;
    border-radius: 5px;
    cursor: pointer;
}

.selected {
    background-color: #eee;
    border-radius: 5px;
}

.row {
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

i {
    margin-left: 8px;
    margin-right: 8px;
    width: 23px;
    height: 15px;
}

.action {
    margin-top: 7px;
    padding-top: 7px;
    color: #414141;
}

.action:hover {
    margin-top: 7px;
    padding-top: 7px;
    cursor: pointer;
}

.action:hover > .fa-trash {
    color: #b3715f !important;
}

.action:hover > .trash {
    color: #b3715f !important;
}

.eye {
    margin-top: 7px;
    padding-top: 10px;
    color: #414141;
    border-top: 1px solid #d1d1d1;
}

.eye:hover {
    margin-top: 7px;
    padding-top: 10px;
    cursor: pointer;
}

input {
    border: 1px solid #d1d1d1;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 8px;
}
    
</style>

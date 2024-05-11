<script>
    import { createEventDispatcher } from 'svelte';
    import { clickOutside } from './utils';
    import { CONDITION, LOGIC } from '../constants/constants';
    import Multiselect from './Multiselect.svelte';

    export let x;
    export let y;
    export let showMenu = false;
    export let content_info = {}; 

    let tag_info = {};
    let prevfilters = [];
    let properties;
    let style = "";
    let filters;

    const dispatch = createEventDispatcher();

    function onChange(e, i, index) {
        if (index < filters[i].length) {
            filters[i][index] = e.target.value;
            if (i == 0) {
                for (const p of properties) {
                    if (p[0] == e.target.value) {
                        filters[i][1] = '0'
                        filters[i][2] = ['', '']
                        filters[i][3] = p[1]['type']
                    }
                }
            }
        }
    }

    function onPageClick(e) {
        showMenu = false;
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'auto';
        console.log(filters)
        dispatch('context', {
            action: 'filters',
            filters: filters 
        })
    }

    function selectUpdate(e, i) {
        console.log(e.detail.selected);
        filters[i][2][0] = e.detail.selected;
    }

    export function openMenu(e, properties2, filterInput) {
        showMenu = false;
        e.preventDefault();
        x = e.clientX;
        y = e.clientY;
        prevfilters = filterInput;
        filters = (prevfilters && prevfilters.length > 0) ? prevfilters : [['name', '0', ['', ''], 'text']]
        properties = [[
            'name', { type: 'text' }
        ], [
            'mark', { type: 'number'}
        ], ...properties2]
        for (const p of properties) {
            if (p[1]['type'] == 'multiselect' || p[1]['type'] == 'singleselect') {
                const c = Object.keys(content_info).find((c) => c == p[0]);
                const content = content_info[c];
                tag_info[c] = content['tag_info']
            }
        }
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'hidden';
        showMenu = true;
    }

    function getConditions(type) {
        if (type == 'text') return CONDITION[0];
        else if (type == 'number') return CONDITION[1];
        else if (type == 'date') return CONDITION[3];
        else if (type == 'checked') return CONDITION[4];
        else return CONDITION[2];
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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style={style} class:show={showMenu} use:clickOutside on:click_outside={onPageClick}>
    <div class={`navbar`} id="navbar">
        <ul>
            {#each filters as filter, index}
            {@const conditions = getConditions(index == 0 ? filter[3] : filter[4])}
            <div class="filter_row">
                <div class="row">
                    {#if index == 0}
                        Where
                    {:else}
                        <select value={filter[4]} on:change={(e) => onChange(e, index, 4)}>
                            {#each LOGIC as l, i}
                                <option value={i.toString()}>{l}</option>
                            {/each}
                        </select>
                    {/if}

                    {#if typeof properties == 'object'}
                    <select value={filter[0]} on:change={(e) => onChange(e, index, 0)}>
                        {#each properties as property, i}
                            <option value={property[0].toString()}>{property[0]}</option>
                        {/each}
                    </select>
                    {/if}
                    <select value={filter[1]} on:change={(e) => onChange(e, index, 1)}>
                        {#each conditions as c, i}
                            <option value={i.toString()}>{c}</option>
                        {/each}
                    </select>
                    {#if filter[3] == 'text'}
                        <input type="text" placeholder="value" bind:value={filter[2][0]}  />
                    {:else if filter[3] == 'number'}
                        {#if filter[1] == 5}
                            <input type="number" placeholder="value" bind:value={filter[2][0]} />
                            AND
                            <input type="number" placeholder="value" bind:value={filter[2][1]} />
                        {:else}
                            <input type="number" placeholder="value" bind:value={filter[2][0]} />
                        {/if}
                    {:else if filter[3] == 'date'}
                        {#if filter[1] == 2}
                            <input type="date" placeholder="value" bind:value={filter[2][0]} />
                            AND
                            <input type="date" placeholder="value" bind:value={filter[2][1]} />
                        {:else}
                            <input type="date" placeholder="value" bind:value={filter[2][0]} />
                        {/if}
                    {:else if filter[3] == 'multiselect' || filter[3] == 'singleselect'}
                        <Multiselect selections={filter[2][0]} properties={tag_info[filter[0]]} 
                            on:select={(e) => selectUpdate(e, index)}/>
                    {/if}
                </div>
                {#if filters.length > 1}
                    <i class="fa-solid fa-trash"
                    on:click={() => {
                        filters.splice(index, 1);
                        // filters[0].splice(4, 1);
                        filters = filters;
                    }}
                    ></i>
                {/if}
            </div>
            {/each}
            <div on:click={() => {
                filters.push(['name', '0', ['', ''], 'text', '0'])
                filters = filters;
            }} class="filter_action">
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="filter_action trash" on:click={(e) => {
                filters = [];
                onPageClick(e)
            }}>
                <i class="fa-solid fa-trash"></i> delete
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

.navbar{
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

select:focus {
    outline: none;
}

select, input {
    border: 1px solid #d1d1d1;
    padding: 8px;
    border-radius: 8px;
    margin-left: 8px;
    margin-right: 8px;
    min-width: 30px;
    margin-top: 5px;
    margin-bottom: 5px;
}

.filter_row {
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex; 
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
}

.row {
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

i {
    margin-left: 8px;
}

.filter_action > i {
    margin-top: 13px;
    margin-right: 8px;
}

.trash {
    margin-top: 15px;
    color: #717171;
    border-top: 1px solid #d1d1d1;
}

.trash:hover {
    margin-top: 15px;
    cursor: pointer;
    border-top: 1px solid #d1d1d1;
}

input {
    border: 1px solid #d1d1d1;
    padding: 8px;
    border-radius: 8px;
}

</style>

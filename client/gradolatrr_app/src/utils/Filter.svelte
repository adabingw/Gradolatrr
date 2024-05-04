<script>
    import { createEventDispatcher, onMount } from 'svelte';
  import NewProperty from './NewProperty.svelte';
  import { clickOutside } from './utils.svelte';

    export let x;
    export let y;
    export let showMenu = false;
    export let properties;

    let style = "";
    let filters = [['0', '0', '']];
    let add = false;

    let condition = [
        'IS', 'IS NOT', 'CONTAINS', 'DOES NOT CONTAIN', 'STARTS WITH', 'ENDS WITH', 'IS EMPTY', 'IS NOT EMPTY'
    ]
    let logic = ['AND', 'OR']

    const dispatch = createEventDispatcher();

    function onChange(e, i, index) {
        console.log(filters)
        if (index < filters[i].length) {
            filters[i][index] = e.target.value;
        }
        console.log(filters)
    }

    function onPageClick(e) {
        showMenu = false;
        // SAVE FILTER
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

select {
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
    border-top: 1px solid #d1d1d1;
}

</style>

{#if showMenu}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style={style} class:show={showMenu} use:clickOutside on:click_outside={onPageClick}>
    <div class={`navbar`} id="navbar">
        <ul>
            {#each filters as filter, index}
            {#if index == 0}
                <div class="filter_row">
                    <div class="row">
                        Where 
                        <select value={filter[0]} on:change={(e) => onChange(e, index, 0)}>
                            {#each properties as property, i}
                                <option value={i.toString()}>{property[0]}</option>
                            {/each}
                        </select>
                        <select value={filter[1]} on:change={(e) => onChange(e, index, 1)}>
                            {#each condition as c, i}
                                <option value={i.toString()}>{c}</option>
                            {/each}
                        </select>
                        <input type="text" placeholder="value" bind:value={filter[2]} 
                            on:change={(e) => onChange(e, index, 2)}/>
                    </div>
                    {#if filters.length > 1}
                        <i class="fa-solid fa-trash"
                        on:click={() => {
                            filters.splice(index, 1);
                            filters[0].splice(0, 1);
                            filters = filters;
                        }}
                        ></i>
                    {/if}
                </div>
            {:else}
                <div class="filter_row">
                    <div class="row">
                    <select value={filter[0]} on:change={(e) => onChange(e, index, 0)}>
                        {#each logic as l, i}
                            <option value={i.toString()}>{l}</option>
                        {/each}
                    </select>  
                    <select value={filter[1]} on:change={(e) => onChange(e, index, 0)}>
                        {#each properties as property, i}
                            <option value={i.toString()}>{property[0]}</option>
                        {/each}
                    </select>
                    <select value={filter[2]} on:change={(e) => onChange(e, index, 0)}>
                        {#each condition as c, i}
                            <option value={i.toString()}>{c}</option>
                        {/each}
                    </select>
                    <input type="text" placeholder="value" bind:value={filter[3]} on:change={(e) => onChange(e, index, 0)}/>
                    <i class="fa-solid fa-trash"
                    on:click={() => {
                        filters.splice(index, 1);
                        filters = filters;
                    }}
                    ></i>
                    </div>
                </div>
            {/if}
            {/each}
            <div on:click={() => {
                filters.push(['0', '0', '0', ''])
                filters = filters;
            }} class="filter_action">
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="filter_action trash">
                <i class="fa-solid fa-trash"></i> delete
            </div>
        </ul>
    </div>
</div>
{/if}

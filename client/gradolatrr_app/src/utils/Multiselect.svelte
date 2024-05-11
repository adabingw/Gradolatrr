<script>
    import { createEventDispatcher } from 'svelte';

    export let properties; // properties to choose from
    export let selections; // properties we've selected

    let selections_list = [];
    let showmulti = false;
	let inputValue = '';

    const dispatch = createEventDispatcher();

    let filteredItems = properties.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));

    // filter dropdown selection on search
    const handleInput = () => {
		filteredItems = properties.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));	
	}

    // delete tag from selected tags
    const deleteSelectedTag = (thing) => {
        selections_list = selections_list.filter(item => !item.toLowerCase().match(thing.toLowerCase()));	
        dispatch('select', {
            text: "data changed",
            selected: selections_list.join(';')
        });
    }

    // add tag to selected tags
    const addTag = (thing) => {
        if(selections_list.includes(thing)) return;
        selections_list.push(thing);	
        console.log(selections_list.join(';'))

        dispatch('select', {
            text: "data changed",
            selected: selections_list.join(';')
        });
    }

    const bubbleUp = () => {
        dispatch('press', {
            text: "clicked"
        })
    }

    const unshow = () => {
        dispatch('close', {
            text: "clicked"
        });
        showmulti = false;
    }

    const show = () => {
        showmulti = true;
    }

    $: {
        selections;
        console.log(selections)
        if (selections != undefined && selections.length > 0) {
            selections_list = selections.split(';')
            console.log(selections_list)
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="multiselect">
<div class="tags" on:click={(e) => {e.stopPropagation(); bubbleUp(); } }>
    {#if properties.length == 0}
        <p style='margin-left: 8px;'>no tags available</p>
    {:else if selections_list.length != 0}
        <span on:click={show}>
            {#each selections_list as thing}
                <p class="tag">{thing} <i class="fa-solid fa-xmark" on:click={(e) => {e.stopPropagation(); deleteSelectedTag(thing)}}></i></p>
            {/each}
        </span>
    {:else if selections_list.length == 0 && !showmulti}
        <input type="text" placeholder="Click to add tag..." readonly bind:value={inputValue} on:click={show} on:input={handleInput} />
    {/if}
    {#if showmulti }
    <div class="multiselect_search" on:click={(e) => e.stopPropagation()}>
        <input type="text" placeholder="Search/create a tag" bind:value={inputValue} on:input={handleInput} />
        <div id="myDropdown" class="dropdown-content">		
            {#if filteredItems.length > 0}
                {#each filteredItems as item}
                    <p class="item" on:click={() => addTag(item)}>{item}</p>
                {/each}
            {:else if selections != undefined}
                {#each selections as item}
                    <p class="item" on:click={() => addTag(item)}>{item}</p>
                {/each}
            {/if}		
        </div>	
    </div>
    {/if}
    </div>
</div>

<style>		
.dropdown-content {
    position: absolute;
    left: 0;
    background-color: #ffffff;
    border: 1px solid #ddd;
    z-index: 1;
}

.multiselect {
    width: 210px;
    max-width: 300px;
    display: flex;
    align-items: center;
    justify-content: start;
}

.multiselect_search {
    position: relative;
}

.item {
    display: flex;
    flex-direction: row;
    padding-left: 8px;
    padding-bottom: 5px;
    padding-right: 8px;
    padding-top: 5px;
    align-items: center;
    justify-content: space-between;
}

.item:hover {
    background-color: #F7F6F3;
    cursor: pointer;
}

.tag {
    border: 1px solid #818181;
    width: fit-content;
    padding-left: 3px;
    padding-bottom: 2px;
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 5px;
    display: flex; 
    flex-direction: row;
    align-items: center;
    margin-top: 2px;
    margin-bottom: 2px;
    text-wrap: wrap;
    overflow-wrap: break-word;
    word-break: break-all;
}

.tags {
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    text-wrap: wrap;
    overflow-wrap: break-word;
}

.fa-xmark {
    margin-left: 5px;
}

</style>

<svelte:window on:click={(e) => unshow()} />

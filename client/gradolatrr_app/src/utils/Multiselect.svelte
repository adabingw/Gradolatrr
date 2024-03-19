<script>
    import { createEventDispatcher } from 'svelte';

    export let properties;
    export let selections;
    export let max;
    let showmulti = false;
	let inputValue = "";

    const dispatch = createEventDispatcher();

    let filteredItems = [];

    const handleInput = () => {
		filteredItems = selections.filter(item => item.toLowerCase().match(inputValue.toLowerCase()));	
	}

    const onkeydown = (e) => {
        if (e.key == "Enter") {
            if (!inputValue) return;
            createTag(inputValue);
        }
    }

    const createTag = (thing) => {
        if (!selections.includes(thing)) {
            selections.push(thing);
        }

        if (max == 1) properties = [];
        properties.push(thing);
        dispatch('course', {
            text: "data changed",
            data: properties, 
            selections: selections
        });
        inputValue = "";
        filteredItems = [];
    }

    const deleteTag = (thing) => {
        selections = selections.filter(item => !item.toLowerCase().match(thing.toLowerCase()));
        dispatch('course', {
            text: "data changed",
            data: properties,
            selections: selections
        });

        deleteSelectedTag(thing);
    }

    const deleteSelectedTag = (thing) => {
        properties = properties.filter(item => !item.toLowerCase().match(thing.toLowerCase()));	
        dispatch('assign', {
            text: "data changed",
            data: properties,
        });
    }

    const addTag = (thing) => {
        if(properties.includes(thing)) return;
        if (max == 1) properties = [];

        properties.push(thing);	

        dispatch('assign', {
            text: "data changed",
            data: properties,
        });
    }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="multiselect">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="tags" on:click={(e) => {e.stopPropagation(); showmulti = true; } }>
    {#if properties.length == 0 && !showmulti}
        <p class="click_to_add_tags">click to add tags...</p>
    {:else}
        {#each properties as thing}
            <p class="tag">{thing} <i class="fa-solid fa-xmark" on:click={() => deleteSelectedTag(thing)}></i></p>
        {/each}
    {/if}
</div>
{#if showmulti}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="multiselect_search" on:click={(e) => e.stopPropagation()}>
    <input type="text" placeholder="Search/create a tag" bind:value={inputValue} autofocus on:keydown={(e) => onkeydown(e)} on:input={handleInput} />
    <div id="myDropdown" class="dropdown-content">		
        {#if filteredItems.length > 0}
            {#each filteredItems as item}
                <p class="item" on:click={() => addTag(item)}>{item} 
                    <i class="fa-solid fa-xmark" on:click={() => deleteTag(item)}></i>
                </p>
            {/each}
        {:else if filteredItems.length == 0 && inputValue != ""}
            <span class="create_tag" on:click={() => createTag(inputValue)}>Create<p class="create">&nbsp;{inputValue}</p></span>
        {:else if selections != undefined}
            {#each selections as item}
                <p class="item" on:click={() => addTag(item)}>{item} 
                    <i class="fa-solid fa-xmark" on:click={() => deleteTag(item)}></i>
                </p>
            {/each}
        {/if}		
    </div>	
</div>
{/if}
</div>

<style>		

input {
    border: 0px solid white;
    outline: none;
}

input:focus {
    border: 0px solid white; 
    outline: none;
}
    
.dropdown-content {
    margin-top: 5px;
    position: absolute;
    background-color: #ffffff;
    min-width: 200px;
    border: 1px solid #ddd;
    z-index: 1;
}

.create_tag {
    display: flex;
    flex-direction: row;
    padding-left: 8px;
    padding-bottom: 5px;
    padding-top: 0px;
    align-items: center;
}

.create_tag:hover {
    background-color: #F7F6F3;
    cursor: pointer;
}

.multiselect {
    width: 210px;
    padding-left: 5px;
    max-width: 500px;
}

.create {
    font-weight: 500;
}

.multiselect_search {
    margin-top: -10px;
    margin-left: -3px;
    margin-bottom: 3px;
}

.click_to_add_tags {
    color: #717171;
}

.item {
    display: flex;
    flex-direction: row;
    padding-left: 8px;
    padding-bottom: 5px;
    padding-top: 0px;
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
    min-height: 15px;
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: -5px;
    padding-bottom: 8px;
    text-wrap: wrap;
    overflow-wrap: break-word;
}

.fa-xmark {
    margin-left: 5px;
}

</style>

<svelte:window on:click={(e) => showmulti = false} />

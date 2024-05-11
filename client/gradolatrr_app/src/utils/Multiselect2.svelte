<script>
    import { createEventDispatcher } from 'svelte';
  import { clickOutside } from './utils';

    export let properties;
    export let selections;
    export let content = {};
    export let j;
    export let max = 0;

    let properties_map;
    let showmulti = false;
	let inputValue = "";

    const dispatch = createEventDispatcher();
    let filteredItems = selections.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));

    const handleInput = () => {
		filteredItems = selections.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));	
	}

    const onkeydown = (e) => {
        if (e.key == "Enter") {
            if (!inputValue) return;
            inputValue = inputValue.replaceAll(';', '');
            createTag(inputValue)
        }
    }

    const createTag = (thing) => {
        if (!selections.includes(thing)) {
            selections.push(thing);
            dispatch('course', {
                text: "course",
            });
        }
        addTag(thing);
        inputValue = ""
        filteredItems = [];
    }

    const deleteTag = (thing) => {
        selections = selections.filter(item => !item.toLowerCase().match(thing.toLowerCase()));        
        properties[j[0]]["tag_info"] = selections;
        dispatch('course', {
            text: "course"
        });
        deleteSelectedTag(thing);
    }

    const deleteSelectedTag = (thing) => {
        properties_map = properties_map.filter(item => !item.toLowerCase().match(thing.toLowerCase()));	
        properties[j[0]]["content"] = properties_map;
        dispatch('assign', {
            text: "assign",
        });
    }

    const addTag = (thing) => {
        if(properties_map.includes(thing)) return;
        if (max == 1) properties_map = [];
        properties_map.push(thing);	
        properties[j[0]]["content"] = properties_map;
        dispatch('assign', {
            text: "assign",
        });
    }

    const unshow = () => {
        showmulti = false;
    }

    const show = () => {
        showmulti = true;
    }

    $: {
        properties;
        if (properties != undefined) {
            if (properties[j[0]] == undefined) {                
                properties_map = []
            } else {
                properties_map = properties[j[0]]["content"]
            }
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="multiselect" use:clickOutside on:click_outside={unshow} on:click={(e) => {e.stopPropagation(); show(); } }>
<div class="tags" on:click={(e) => {e.stopPropagation(); } }>
    {#if properties_map.length == 0 && !showmulti}
        <input type="text" placeholder="Click to add tag..." readonly bind:value={inputValue} on:click={show} on:input={handleInput} />
    {:else}
        {#each properties_map as thing}
            <p class="tag">{thing} <i class="fa-solid fa-xmark" on:click={(e) => {e.stopPropagation(); deleteSelectedTag(thing)}}></i></p>
        {/each}
    {/if}
    {#if showmulti }
    <div class="multiselect_search" on:click={(e) => e.stopPropagation()}>
        <input type="text" placeholder="Search/create a tag" bind:value={inputValue} on:keydown={(e) => onkeydown(e)} on:input={handleInput} />
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
</div>

<style>		
.dropdown-content {
    position: absolute;
    left: 0;
    background-color: #ffffff;
    border: 1px solid #ddd;
    z-index: 1;
}

.create_tag {
    display: flex;
    flex-direction: row;
    padding-left: 8px;
    padding-bottom: 5px;
    padding-top: 5px;
    align-items: center;
}

.create_tag:hover {
    background-color: #F7F6F3;
    cursor: pointer;
}

.multiselect {
    width: 210px;
    max-width: 300px;
    display: flex;
    align-items: center;
    justify-content: start;
}

.create {
    font-weight: 500;
    margin-right: 10px;
}

.multiselect_search {
    position: relative;
}

.item {
    display: flex;
    flex-direction: row;
    padding-left: 8px;
    padding-bottom: 5px;
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

<script>
    import { createEventDispatcher } from "svelte";

    export let info;
    export let selected;

    const dispatch = createEventDispatcher();

    function typeChange() {
        dispatch('message', {
            data: selected
        });
    }
</script>

<div>
    <select name="tags" bind:value={selected} on:change={typeChange}>
        {#each info as i}
        {@const text = `${i[1]}\u00A0\u00A0\u00A0${i[0]}`}
            <option value={i[0]}>
                {text}
            </option>
        {/each}
    </select>
</div>

<style>
select {
    padding: 6px;
    border: 0px solid white;
    font-family: "Segoe UI", 'FontAwesome', 'sans-serif';
}

select:focus {
  border-left: none;
  border-top: none;
  border-right: none;
  outline: none;
}

option {
    padding-top: 32px;
    padding-bottom: 32px;
    height: calc(1.2em + 40px);
}

option:checked {  
  background-color: #919191;
}

option:hover {
    background-color: antiquewhite;
}
</style>

<script>
    import { createEventDispatcher } from "svelte";
    export let text;
    export let inputText;
    export let type;
    export let max;
    export let min;
    export let focus;

    const dispatch = createEventDispatcher();

    function dataChange(e) {
        dispatch('message', {
            text: "data changed",
            data: inputText
        });
    }

    function handleKeydown(e) {
        if (e.key != 'Enter') return;
        dispatch('enter', {
            text: "enter pressed"
        });
    }
</script>

<div class="input-row ">
  {#if focus}
    {#if type == "text"}
      <input type="text" class="input-text" autofocus placeholder={text} on:keydown={handleKeydown}
          bind:value={inputText} on:input={dataChange} />
    {:else if type == "number"}
      <input type="number" class="input-text" autofocus placeholder={text} on:keydown={handleKeydown}
          max={max} min={min} bind:value={inputText} on:input={dataChange} />
    {/if}
  {:else} 
    {#if type == "text"}
      <input type="text" class="input-text" placeholder={text} on:keydown={handleKeydown}
          bind:value={inputText} on:input={dataChange} />
    {:else if type == "number"}
      <input type="number" class="input-text" placeholder={text} max={max} min={min} on:keydown={handleKeydown}
          bind:value={inputText} on:input={dataChange} />
    {/if}
  {/if}
</div>

<style>

.input-text {
  padding: 5px;
  border-left: none;
  border-top: none;
  border-bottom: none;
  border-right: none;
  width:100%
}

input {
  width:100%;
  color: #818181;
}

.input-row {
  display: flex;
  flex-direction: row;
  width:100%
}

</style>

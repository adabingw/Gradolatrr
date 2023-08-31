<script>
    import { createEventDispatcher } from "svelte";
    export let text;
    export let inputText;
    export let type;
    export let max;
    export let min;
    export let focus;

    const dispatch = createEventDispatcher();

    function dataChange() {
        dispatch('message', {
            text: "data changed",
            data: inputText
        });
    }
</script>

<div class="input-row">
  {#if focus}
    {#if type == "text"}
      <input type="text" class="input-text" autofocus placeholder={text} 
          bind:value={inputText} on:input={dataChange} />
    {:else if type == "number"}
      <input type="number" class="input-text" autofocus placeholder={text} max={max} min={min}
          bind:value={inputText} on:input={dataChange} />
    {/if}
  {:else} 
    {#if type == "text"}
      <input type="text" class="input-text" placeholder={text} 
          bind:value={inputText} on:input={dataChange} />
    {:else if type == "number"}
      <input type="number" class="input-text" placeholder={text} max={max} min={min}
          bind:value={inputText} on:input={dataChange} />
    {/if}
  {/if}
</div>

<style>

.input-text {
  padding: 5px;
  margin-bottom: 20px;
  border-left: none;
  border-top: none;
  border-right: none;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  min-width: 120px;
  max-width: 200px;
}

.input-text:focus {
  border-left: none;
  border-top: none;
  border-right: none;
  outline: none;
}

.input-row {
  display: flex;
  flex-direction: row;
}

</style>

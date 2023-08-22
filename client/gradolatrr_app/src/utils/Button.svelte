<script>
// @ts-nocheck

  	import { Router, Link, Route } from "svelte-navigator";
    export let id;
    export let type;
    // @ts-ignore
    export let name;
    let url = `/${type}/${id}/${name}`
</script>

{#if type == "course"}
  <Link to={url}><p class={type}>{name}</p></Link>
{:else if type == "term"}
  <p class={type}>{name}</p>
{/if}

<style>
.term {
  height: 2px;
  margin-top: 8px;
  margin-bottom: 25px;
  font-weight: bold;
}

.term:hover {
  cursor: pointer;
}

.course {
  margin-left: 8px;
  margin-top: 20px;
  height: 2px;
}

.course:hover {
  cursor: pointer;
}
</style>

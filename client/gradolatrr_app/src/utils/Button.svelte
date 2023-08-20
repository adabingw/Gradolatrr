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

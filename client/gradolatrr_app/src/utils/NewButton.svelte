<script>
    import { Link } from "svelte-navigator";
    export let type;
    export let name;
    let url = `/${type}`
</script>

<Link to={url}><p class="new">{name}</p></Link>

<script>
    let id = 1129;
    let checked;

    import { Link } from "svelte-navigator";
    import TextField from "../utils/TextField.svelte";

    let def = {
        "2A": {
            metadata: {
                name: "2A",
                type: "term",
                id: id,
                archived: false,
                current: false,    
            }, 
        }
    }

    function addProperty() {
        console.log("add property")
    }


</script>

<div>
    <p>Create new term</p>
    <TextField text="term name"/>
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
        <!-- CHECK IF HAS CURRENT TERM FOR OTHER TERM. IF YES, RAISE ERROR -->
    </label>
    <p class="term-changes" on:click={addProperty}>+ add property</p>
    <div style=" display:flex; flex-direction:row; ">
        <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
        <p class="cancel-and-save">save</p>
    </div>
</div>

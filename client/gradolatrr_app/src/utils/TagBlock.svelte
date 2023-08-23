<script>
    export let properties;

    import Button from "./Button.svelte";
</script>

<div>
    <div class="tag-block">
        {#each properties as tag}
            <div class="tag" style={`background-color: ${tag[1]}`}>
                {tag[0]}
            </div>
        {/each}
    </div>
    <Button text="+ add tag" />
</div>

<style>
.tag {
    text-align: center;
    border-radius: 12px;
    padding-top: 8px;
    padding-bottom: 8px; 
    padding-left: 12px;
    padding-right: 12px;
    margin-top: 8px;
}
</style>

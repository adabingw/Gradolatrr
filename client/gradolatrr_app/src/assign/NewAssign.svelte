<script>
    let id;
    let name;
    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let foo = true;

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import TextArea from '../utils/TextArea.svelte';

    let course_content = {
        type: "desc",
        "name": {
            checked: true, 
            type: "number", 
            required: true,
        },
        "mark": {
            checked: true, 
            type: "number", 
            required: false,
        },
        "weighting": {
            checked: true, 
            type: "number", 
            required: false,
        },
        "tags": {
            checked: true, 
            type: "tags",
            required: false,
        },
        "description": {
            checked: false, 
            type: "textarea",
            required: false,
        }
    }
    let properties = {
        metadata: {
            name: name,
            type: "item",
            id: id,
            course_id: course_id,
            course_name: course_name,
            term_id: term_id,
            term_name: term_name
        },
        content: {

        },
    }

    for (let i of Object.keys(course_content)) {
        if (i == "type") continue;
        properties["content"][i] = "";
    }

    function saveChanges() {
        console.log("save changes")
    }

</script>

<div>
    <p>Create new item   {term_name}/{course_name}</p>
    <TextField type="text" text="item name" bind:inputText={name}/>
    <Table>
        <TableBody>
        {#each Object.keys(course_content) as i}
            <TableBodyRow>
            {#if i != "type"}
            <div>
                <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                <TableBodyCell>
                {#if course_content[i]["type"] == "textarea"}
                    <TextArea bind:inputText={properties["content"][i]} bind:changed={foo} />
                {:else if course_content[i]["type"] == "text"}
                    <TextField type="text" text="" bind:inputText={properties["content"][i]}/>
                {:else if course_content[i]["type"] == "number"}
                    <TextField type="number" text="" bind:inputText={properties["content"][i]}/>
                {/if}
                </TableBodyCell>
            </div>
            {/if}
            </TableBodyRow>
        {/each}
        </TableBody>
    </Table>
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>


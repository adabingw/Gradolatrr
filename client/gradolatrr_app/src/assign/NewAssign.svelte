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
    import Dropdown from '../utils/Dropdown.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import TextArea from '../utils/TextArea.svelte';
    import course_info from "../data/course_info.json";
    import new_assign from "../data/new_assign.json";

    let course_content = course_info[course_name]["content_info"]
    new_assign["course_id"] = course_id;
    new_assign["course_name"] = course_name;
    new_assign["term_id"] = term_id;
    new_assign["term_name"] = term_name;

    for (let i of Object.keys(course_content)) {
        if (i == "type") continue;
        new_assign["content"][i] = "";
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
                    <TextArea bind:inputText={new_assign["content"][i]} bind:changed={foo} />
                {:else if course_content[i]["type"] == "text"}
                    <TextField type="text" text="" bind:inputText={new_assign["content"][i]}/>
                {:else if course_content[i]["type"] == "number"}
                    <TextField type="number" text="" bind:inputText={new_assign["content"][i]}/>
                {:else if course_content[i]["type"] == "tags"}
                    <!-- ADD BINDING -->
                    <Dropdown info={course_info[course_name]["tags"]["content"]} />
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

<style>


</style>

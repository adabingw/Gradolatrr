<script>
    let id;
    let name;
    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let num;
    let foo = true;
    let suffix;
    let date = new Date()
    let dates = []

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    import { DateInput } from 'date-picker-svelte'
    
    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import TextArea from '../utils/TextArea.svelte';
    import Button from '../utils/Button.svelte';
    import course_info from "../data/course_info.json";
    import new_assign from "../data/new_assign.json";

    let course_content = course_info["content_info"];
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

    function newDateSelected() {
        console.log(dates, date)
        if (dates.includes(date)){
            const i = dates.indexOf(date);
            dates.splice(i, 1);
        } else {
            dates.push(date);
        }
    }

</script>

<div>
    <p>Create item bundle   {term_name}/{course_name}</p>

    <TextField type="number" text="num items" bind:inputText={num}/>
    <Button text="manually input names"/>
    
    <p>item suffix (ie: ECON ASSGN)</p>
    <TextField type="text" text="" bind:inputText={suffix}/>

    <!-- <DateInput bind:value={date} on:select={() => {newDateSelected()}} format="yyyy-MM-dd"/> -->
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


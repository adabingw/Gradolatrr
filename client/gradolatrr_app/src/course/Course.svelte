<script>
    // @ts-nocheck
    
        export let id;
        export let name;
    
        import Close from '../assets/delete_icon.png'
        import Edit from '../assets/edit_icon.png'
        import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
        import { Link } from 'svelte-navigator';

        // get info from id
        let course_info = {
            "ECON101": {
                metadata: {
                    type: "course",
                    id: "abcde",
                    term_id: "abcde",
                    term_name: "ECON101",
                },
                content: {
                    "assignment 1": {
                        type: "course_mat", 
                        id: "aaa",
                        content: {
                            "name": "assignment 1",
                            "mark": 100,
                            "weight": 2,
                            "tags": ['assignment'], 
                            "description": ""
                        }
                    }, 
                    "assignment 2": {
                        type: "course_mat", 
                        id: "aab",
                        content: {
                            "name": "assignment 2",
                            "mark": 85,
                            "weight": 5,
                            "tags": ['assignment'], 
                            "description": ""
                        }
                    }, 
                    "midterm": {
                        type: "course_mat", 
                        id: "aac",
                        content: {
                            "name": "midterm",
                            "mark": 100,
                            "weight": 2,
                            "tags": ['midterm'], 
                            "description": "covers module 1 - 3"
                        }
                    }, 
                    "lab 2": {
                        type: "course_mat", 
                        id: "aad",
                        content: {
                            "name": "lab 2",
                            "mark": 59,
                            "weight": 3,
                            "tags": ['lab'], 
                            "description": "covers acids and bases"
                        }
                    }, 
                    "final": {
                        type: "course_mat", 
                        id: "aae",
                        content: {
                            "name": "final",
                            "mark": 88,
                            "weight": 30,
                            "tags": ['final'], 
                            "description": "must pass in order to pass course"
                        }
                    }
                },
                description: {
                    type: "textbox",
                    content: "hello"
                }, 
                resource: {
                    type: "textbox",
                    content: "resource"
                },
                tags: {
                    type: "tags",
                    content: ['assignment', 'final', 'midterm', 'lab']
                },
                content_info: {
                    type: "desc",
                    "name": {
                        default: true,
                        checked: true,
                        type: "string"
                    },
                    "mark": {
                        checked: true, 
                        type: "number" 
                    },
                    "weight": {
                        checked: true, 
                        type: "number" 
                    },
                    "tags": {
                        checked: true, 
                        type: "tags" 
                    },
                    "description": {
                        checked: false, 
                        type: "number" 
                    }
                }
            }
        }
    
        let content = course_info[name]["content"]
        let content_info = course_info[name]["content_info"]
        let changed;
        
        function addAssignment() {
            console.log("add assignment")
        }
    
        function deleteAssignment(item) {
            console.log("deleting type")
            // delete term_info[name]["content_info"][item]
            // info = term_info[name]
        }
    
        function saveChanges() {
            console.log("save changes")
        }
    
    </script>
    
    <div>
        <p>
            {name} <Link to={`/course/edit/${id}/${name}`}><img  src={Edit} alt="edit"/> </Link>
        </p>    
        {#if content != undefined}
        <Table>
            <TableHead>
              {#each Object.keys(content_info) as i}
                {#if i != "type" && content_info[i]["checked"]}
                    <TableHeadCell><p class="term-header">{i}</p></TableHeadCell>
                {/if}
              {/each}
              <TableHeadCell> </TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each Object.keys(content) as i}
                <TableBodyRow class="TableBodyRow">
                    {#each Object.keys(content[i]["content"]) as j}
                        {#if content_info[j]["checked"]}
                        <TableBodyCell>{content[i]["content"][j]}</TableBodyCell>
                        {/if}
                    {/each}
                    <Link to={`/assign/edit/${content[i]["id"]}/${content[i]["content"]["name"]}`}><TableBodyCell class="edit">edit</TableBodyCell></Link>
                </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
        {/if}
        <p class="save-changes" on:click={addAssignment}>+ add item</p>
        <p class="save-changes" on:click={addAssignment}>+ add bundle</p>
    </div>
    
<style>
.edit {
   color: teal;
}

.edit:hover {
  cursor: pointer;
}
</style>

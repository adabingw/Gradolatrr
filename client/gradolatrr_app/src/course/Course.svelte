<script>
    // @ts-nocheck
    
        export let term_id;
        export let term_name;
        export let id;
        export let name;
    
        import Edit from '../assets/edit_icon.png'
        import Button from '../utils/Button.svelte';

        import { Table, TableSearch, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
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

        let sortKey = 'name'; // default sort key
        let sortDirection = 1; // default sort direction (ascending)

        let content_array = []

        for (const key in content) {
            content_array.push([ key, content[key] ])
        }

        // Define a function to sort the items
        const sortTable = (key) => {
            // If the same key is clicked, reverse the sort direction
            if (sortKey === key) {
                sortDirection = -sortDirection;
            } else {
                sortKey = key;
                sortDirection = 1;
            }

            console.log(content_array)

            const sorted = content_array.sort((a, b) => {
                console.log(a, b)
                const aVal = a[1]["content"][key];
                const bVal = b[1]["content"][key];
                console.log(aVal, bVal)
                if (aVal < bVal) {
                    return -sortDirection;
                } else if (aVal > bVal) {
                    return sortDirection;
                }
                return 0;
            });

            console.log(sorted)
            content_array = sorted;
        };
        
    </script>
    
    <div>
        <p>
            {name} <Link to={`/course/edit/${id}/${name}`}><img  src={Edit} alt="edit"/> </Link>
        </p>    
        {#if content_array != undefined || content_array != null}
        <Table>
        <!-- <TableSearch placeholder="Search by maker name" hoverable={true} bind:inputValue={searchTerm}> -->
            <TableHead>
              {#each Object.keys(content_info) as i}
                {#if i != "type" && content_info[i]["checked"]}
                    <TableHeadCell on:click={() => sortTable(i)}>
                        <p class="term-header">{i}</p>
                    </TableHeadCell>
                {/if}
              {/each}
              <TableHeadCell> </TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each Object.keys(content_array) as i}
                <TableBodyRow class="TableBodyRow">
                    {#each Object.keys(content_array[i][1]["content"]) as j}
                        {#if content_info[j]["checked"]}
                        <TableBodyCell>{content_array[i][1]["content"][j]}</TableBodyCell>
                        {/if}
                    {/each}
                    <Link to={`/assign/edit/${content_array[i][1]["id"]}/${content_array[i][1]["content"]["name"]}`}>
                        <TableBodyCell class="edit">edit</TableBodyCell>
                    </Link>
                </TableBodyRow>
                {/each}
            </TableBody>
        <!-- </TableSearch> -->
        </Table>
        {/if}
        <!-- INCLUDE LINK TO STUFF -->
        <Link to={`/new_assign/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add item" on:click={addAssignment} /></Link>
        <Link to={`/new_assignbundle/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add bundle" on:click={addAssignment} /></Link>
    </div>
    
<style>
.edit {
   color: teal;
}

.edit:hover {
  cursor: pointer;
}
</style>

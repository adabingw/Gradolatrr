<script>
    import { query } from "svelte-apollo";
    
    import { ALL_COURSES } from "../constants/queries_get";
    import Button from "../utils/Button.svelte";
    import Modal from "../utils/Modal.svelte";

    // @ts-nocheck
    export let w;
    let exporting = false;
    let importing = false;
    let exportText = "Export to JSON";
    let importText = "Import from JSON";
    let showModal = false;
    let info;
    let last_info;

    const query_result = query(ALL_COURSES);
    

    function exportData() {
        if (importing) return;
        let exportData = {}
        if (info) {
            for (let i = 0; i < info["allTerm"]["items"].length; i++) {
                info["allTerm"]["items"][i]["data"] = JSON.parse(info["allTerm"]["items"][i]["data"]);
                let data = {}
                for (const k in info["allTerm"]["items"][i]["data"]) {
                    data[k] = Object.keys(info["allTerm"]["items"][i]["data"][k])
                        .filter( record => record != "order")
                        .reduce((obj, key) => {
                            obj[key] = info["allTerm"]["items"][i]["data"][k][key];
                            return obj;
                        }, {});
                }
                let courses = []
                for (const k in info["allTerm"]["items"][i]["courses"]) {
                    info["allTerm"]["items"][i]["courses"][k]["data"] = JSON.parse(info["allTerm"]["items"][i]["courses"][k]["data"]);
                    info["allTerm"]["items"][i]["courses"][k]["content_info"] = JSON.parse(info["allTerm"]["items"][i]["courses"][k]["content_info"]);
                        
                    let c = info["allTerm"]["items"][i]["courses"][k]
                    delete c["id"]
                    delete c["order"]
                    
                    let data = {}
                    for (const j in c["data"]) {
                        data[j] = Object.keys(c["data"][j])
                            .filter( record => {
                                return record != "order"
                            })
                            .reduce((obj, key) => {
                                obj[key] = c["data"][j][key];
                                return obj;
                            }, {});
                    }

                    let content_info = {}
                    for (const j in c["content_info"]) {
                        content_info[j] = Object.keys(c["content_info"][j])
                            .filter( record => record != "order" && record != "required")
                            .reduce((obj, key) => {
                                obj[key] = c["content_info"][j][key];
                                return obj;
                            }, {});
                    }
                    c["content_info"] = content_info;
                    c["data"] = data;

                    let assignments = []
                    for (const a in c["assignments"]) {
                        let assignment = c["assignments"][a]
                        delete assignment["id"]

                        let data = {}

                        if (assignment["data"]) {
                            assignment["data"] = JSON.parse(assignment["data"])
                            for (const j in assignment["data"]) {
                                data[j] = Object.keys(assignment["data"][j])
                                    .filter( record => record != "order")
                                    .reduce((obj, key) => {
                                        obj[key] = assignment["data"][j][key];
                                        return obj;
                                    }, {});
                            }
                        }
                        
                        assignment["data"] = data;
                        assignments.push(assignment);
                    }
                    c["assignments"] = assignments;
                    courses.push(c);
                }
                exportData[info["allTerm"]["items"][i]["name"]] = {
                    "name": info["allTerm"]["items"][i]["name"],
                    "type": info["allTerm"]["items"][i]["type"],
                    "grade": info["allTerm"]["items"][i]["grade"],
                    "data": data,
                    "courses": courses
                }
            }
        }
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(exportData)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = "graku_download_" + Date.now();
        a.click();
    }

    function importData() {
        if (exporting) return;
        importing = true;
        importText = "Importing ..."
    }

    $: {
        if (!showModal && exporting) {
            exportText = "Exporting..."
        }
    }

    $: {
        $query_result;
        if ($query_result.data != undefined) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
        }
    }
</script>

<div class="dashboard" style={`width: ${70-w}vw`}>
    <!-- <Modal bind:showModal>
        <h2 slot="header">
        </h2>
        &lbrace; &rbrace;
    </Modal> -->
    <!-- <Modal bind:showModal>
        <div class="subheader">Select items to export (default all)</div>
        {#if info != undefined}
        {#each Object.keys(info.allTerm["items"]) as i}
            {#if info.allTerm["items"][i] != undefined} 
            <div class="terms">
                <div class="term">
                    <input type="checkbox" bind:checked={info["allTerm"]["items"][i]["checked"]} />
                    {info.allTerm["items"][i]["name"]}
                </div>
                <div>
                {#each Object.keys(info.allTerm["items"][i]["data"]) as data}
                <div class="term_data">
                    <input type="checkbox" bind:checked={info["allTerm"]["items"][i]["data"][data]["checked"]} />
                    {data}
                </div>
                {/each}
                </div>
            </div>
            {/if}
            <div class="courses">
                {#each Object.keys(info.allTerm["items"][i]["courses"]) as j}
                    <div class="course">
                        <input type="checkbox" bind:checked={info["allTerm"]["items"][i]["courses"][j]["checked"]} />
                        {info.allTerm["items"][i]["courses"][j]["name"]}
                    </div>
                    <div class="course_data">
                        {#each Object.keys(info.allTerm["items"][i]["courses"][j]["data"]) as data}
                        <div>
                            <input type="checkbox" bind:checked={info["allTerm"]["items"][i]["courses"][j]["data"][data]["checked"]} />
                            {data}
                        </div>
                        {/each}
                    </div>
                    <div class="content_info">
                        {#each Object.keys(info.allTerm["items"][i]["courses"][j]["content_info"]) as data}
                        <div>
                            <input type="checkbox" bind:checked={info["allTerm"]["items"][i]["courses"][j]["content_info"][data]["checked"]} />
                            {data}
                        </div>
                        {/each}
                    </div>
                    <div class="assignments">
                        {#each info.allTerm["items"][i]["courses"][j]["assignments"] as data}
                        <div class="assignment">
                             <input type="checkbox" bind:checked={data["checked"]} />
                            {data["name"]}
                        </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}
        {/if}
    </Modal> -->
    <p class="subheader">Profile</p>
    <p class="note">This is a demo</p>
    <div class="row">
        <div>
            <div class="head">
                Display name
            </div>
            <div class="content">
                blingblingda
            </div>
        </div>
    </div>

    <p class="subheader">Account security</p>
    <p class="note">This is a demo</p>
    <div class="row">
        <div>
            <div class="head">
                Email
            </div>
            <div class="content">
                abwang@uwaterloo.ca
            </div>
        </div>
        <Button text={"Change email"}  icon=""/>
    </div>

    <div class="row">
        <div>
            <div class="head">
                Password
            </div>
            <div class="content">
                Set a password to log into your account
            </div>
        </div>
        <Button text={"Change password"}  icon=""/>
    </div>

    <div class="row">
        <div>
            <div class="head">
                2 factor authorization
            </div>
            <div class="content">
                Add an additional layer of security to your account during login
            </div>
        </div>
        <Button text={"Set up 2FA"} icon=""/>
    </div>

    <p class="subheader">Export</p>
    <p class="note">Export your grades as a JSON file</p>
    <Button bind:text={exportText} icon={"fa-solid fa-arrow-right-from-bracket"} on:message={exportData}/>

    <p class="subheader">Import</p>
    <p class="note">Import your grades <span> | 
        <span on:click={() => {showModal = true;} } class="hover">See example file</span>
    </span></p>
    <Button bind:text={importText} icon={"fa-solid fa-arrow-right-to-bracket"}  on:message={importData}/>

    <p class="subheader">Support</p>
    <p class="note">This is a demo</p>
    <div class="row">
        <div>
            <div class="head">
                Logout
            </div>
            <div class="content">
                Log out of this account
            </div>
        </div>
    </div>

    <div class="row">
        <div>
            <div class="head alert">
                Delete account
            </div>
            <div class="content">
                Permanently delete account (cannot be undone!)
            </div>
        </div>
    </div>
</div>

<style>
p {
    margin-bottom: 0px;
    padding-bottom: 0px;
}

.hover:hover {
    cursor: pointer;
}

.note {
    color: #717171;
    font-size: 15px;
}

.alert:hover {
    cursor: not-allowed;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.head {
    margin-top: 12px;
    margin-bottom: 3px;
    font-weight: 400;
}

.content {
    color: #717171;
    font-size: 15px;
}

.dashboard {
    height: 100%;
    text-align: left;
    display: flex;
    justify-content: left;
    flex-direction: column;
    margin: 30px 80px 250px 80px;
}

.terms {
    margin-top: 5px;
}

.term_data {
    margin-left: 15px;
}

.courses {
    margin-top: 5px;
    margin-left: 15px;
}

.course_data {
    margin-left: 20px;
}

.content_info {
    margin-left: 20px;
}

.assignments {
    margin-top: 5px;
    margin-left: 40px;
}
</style>

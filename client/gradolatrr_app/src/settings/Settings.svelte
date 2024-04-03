<script>
  import Button from "../utils/Button.svelte";

    // @ts-nocheck
    export let w;
    let exporting = false;
    let importing = false;
    let exportText = "Export to JSON";
    let importText = "Import from JSON";

    function exportData() {
        if (importing) return;
        exporting = true;
        exportText = "Exporting ..."
    }

    function importData() {
        if (exporting) return;
        importing = true;
        importText = "Importing ..."
    }
</script>

<div class="dashboard" style={`width: ${70-w}vw`}>
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
    <p class="note">Export your grades as a CSV file</p>
    <Button bind:text={exportText} icon={"fa-solid fa-arrow-right-from-bracket"} on:message={exportData}/>

    <p class="subheader">Import</p>
    <p class="note">Import your grades</p>
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
</style>

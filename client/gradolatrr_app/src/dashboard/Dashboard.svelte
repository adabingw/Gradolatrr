<script>
// @ts-nocheck
    export let text;

</script>

<div class="dashboard">
    <p>welcome to gradolatrr. <a href="https://github.com/adabingw/gradolatrr" target="_blank"><i class="fa-brands fa-github"></i></a></p>
    <div class="journey">
        this is version 3 of this project. <br />
        version 1: August 2021. Java AWT and MySQL. <br />
        version 2: August 2022. (using Electron) with a PERN stack. <br/>
        version 3: August 2023. Svelte and DynamoDB, integrated with GraphQL and AWS AppSync.
    </div>
</div>

<style>
i {
    margin-left: 8px;
}

i:hover {
    cursor: pointer;
}

p {
    font-weight: bold;
    margin-bottom: 15px;
}

.dashboard {
    width: 100%;
    height: 100%;
    text-align: left;
    margin-left: -50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.journey {
    text-align: left;
}


</style>

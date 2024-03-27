<script>
// @ts-nocheck
</script>

<div class="dashboard">
    <p class="head">Welcome to Graku Graku</p>
    <p>A grade calculator system on your fingertips! (Waku Waku, so cool!!)</p>

    <p>Itty bitty <strong>timeline</strong> of how this project was built:</p>
        
    <div class="time_header">
        <i class="fa-solid fa-circle fa-xs"></i>
        <span class="time">August 2021</span>
    </div>
    <div class="content">First ever version, build with Java AWT and MySQL</div>

    <div class="time_header">
        <i class="fa-solid fa-circle fa-xs"></i>
        <span class="time">August 2022</span>
    </div>
    <div class="content">Second version, PERN (PostgreSQL, Express, React, Node) stack (with Electron)</div>

    <div class="time_header">
        <i class="fa-solid fa-circle fa-xs"></i>
        <span class="time">August 2023 (AND BEYOND)</span>
    </div>
    <div class="content"> <em>What you're looking at right now!</em> <br />
        Svelte + DynamoDB, integrated with GraphQL and AWS AppSync</div>

    <div class="socials">
        <div class="social">
            <a href="https://github.com/adabingw/graku" target="_blank"><i class="fa-brands fa-github"></i></a> Where the code lives.
        </div>
        <div class="social">
            <a href="linkedin.com/in/adabingw" target="_blank"><i class="fa-brands fa-linkedin"></i></a> Where I am.
        </div>
    </div>


</div>

<style>
.social {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.socials {
    margin-top: 30px;
}

.fa-brands:hover {
    cursor: pointer;
    color: #515151 !important;
}
p {
    margin-bottom: 0px;
    padding-bottom: 0px;
}
.head {
    font-size: 30px;
    font-weight: 800;
    color: #717171;
    padding-bottom: 0px;
    margin-bottom: 0px;
}
.content {
    padding-left: 15px;
    border-left: 1px solid grey;
    margin-left: 6px;
}

.time {
    font-weight: 600;
}

.dashboard {
    width: 80%;
    height: 100%;
    text-align: left;
    display: flex;
    justify-content: left;
    align-items: top;
    flex-direction: column;
    margin: 130px 130px 130px 130px;
}

.time_header {
    display: flex;
    flex-direction: row;
    align-items: center;   
    margin-top: 15px;
}

.fa-circle {
    margin-right: 10px;
}
</style>

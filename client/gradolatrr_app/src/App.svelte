<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import { Router, Route } from "svelte-navigator";

    import Sidebar from "./sidebar/Sidebar.svelte";
    import Dashboard from "./dashboard/Dashboard.svelte";
    import Term from "./term/Term.svelte";
    import Course from "./course/Course.svelte";
    import CourseInfo from "./course/CourseInfo.svelte";
    import Assign from "./assign/Assign.svelte";
    import NewTerm from "./term/NewTerm.svelte";
    import NewCourse from "./course/NewCourse.svelte";

    onMount(async () => {
        // get info for user
    });

    let info = {
        "2A": {
            type: "term",
            id: "1234567890",
            course: {
                "ECON101": {
                    type: "course",
                    id: "abcde"
                },
                "PSYCH101": {
                    type: "course",
                    id: "fgjijk"
                }
            }
        }
    }
</script>

<div>
  <Router>
      <div class="flex-row">
          <Sidebar class="sidebar" info={info} />
          <div class="homepage">
            <Route path="/*">
                <Dashboard text="dashboard"/>
            </Route>
            <Route path="new_course/:id/:name" let:params>
                <NewCourse term_id={params.id} term_name={params.name} />
            </Route>
            <Route path="new_term">
                <NewTerm />
            </Route>
            <Route path="course/:id/:name" let:params>
                <Course id={params.id} name={params.name} />
            </Route>
            <Route path="term/:id/:name" let:params>
                <Term id={params.id} name={params.name} />
            </Route>
            <Route path="course/edit/:id/:name" let:params>
                <CourseInfo id={params.id} name={params.name} />
            </Route>
            <Route path="assign/edit/:id/:name" let:params>
                <Assign id={params.id} name={params.name} />
            </Route>
          </div>
      </div>
  </Router>
</div>  

// https://svelte.dev/repl/6fb90919e24942b2b47d9ad154386b0c?version=3.49.0 -- context menu
// https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0
// https://stackoverflow.com/questions/50702662/passing-parent-method-to-child-in-svelte

<style>
.homepage {
  margin-left: 50px;
  margin-top: 20px;
  overflow: scroll;
  height: 100vh;
  width: 83vw;
}    
</style>

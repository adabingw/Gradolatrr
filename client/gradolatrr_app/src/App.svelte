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
            <Route path="/new_term">
                <Dashboard text="new term"/>
            </Route>
            <Route path="/new_course">
                <Dashboard text="new course"/>
            </Route>
            <Route path="/new_term">
                <Dashboard text="new term"/>
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

<script>
// @ts-nocheck
    import { Router, Route } from "svelte-navigator";
    import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client/core";
    import { setClient } from "svelte-apollo";
    import { createAuthLink } from "aws-appsync-auth-link";
    import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
    
    import Sidebar from "./sidebar/Sidebar.svelte";
    import Dashboard from "./dashboard/Dashboard.svelte";
    import Term from "./term/Term.svelte";
    import Course from "./course/Course.svelte";
    import CourseInfo from "./course/CourseInfo.svelte";
    import Assign from "./assign/Assign.svelte";
    import NewTerm from "./term/NewTerm.svelte";
    import NewCourse from "./course/NewCourse.svelte";
    import NewAssign from "./assign/NewAssign.svelte";
    import NewAssignBundle from "./assign/NewAssignBundle.svelte";
    import { APPSYNC_GRAPHQLENDPOINT, APPSYNC_APIKEY, APPSYNC_REGION, APPSYNC_AUTHTYPE} from "./constants/aws_config.js";

    let sidebarReload = false;

    const url = APPSYNC_GRAPHQLENDPOINT;
    const region = APPSYNC_REGION;
    const auth = {
        type: APPSYNC_AUTHTYPE,
        apiKey: APPSYNC_APIKEY
    };
    const httpLink = new HttpLink({ uri: url });
    const link = ApolloLink.from([
        createAuthLink({ url, region, auth }),
        createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
    ]);
    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
    });

    setClient(client);

    function triggerReload() {
        sidebarReload = true;
    }
    
</script>

<div>
  <Router>
      <div class="flex-row">
          <Sidebar class="sidebar" bind:reload={sidebarReload} />
          <div class="homepage">
            <Route path="/*">
                <Dashboard text="dashboard"/>
            </Route>
            <Route path="/new_course/:id/:name" let:params>
                <NewCourse term_id={params.id} term_name={params.name} on:message={triggerReload}/>
            </Route>
            <Route path="/new_assign/:term_id/:term_name/:course_id/:course_name" let:params>
                <NewAssign term_id={params.term_id} term_name={params.term_name} 
                            course_id={params.course_id} course_name={params.course_name} />
            </Route>
            <Route path="/new_assignbundle/:term_id/:term_name/:course_id/:course_name" let:params>
                <NewAssignBundle term_id={params.term_id} term_name={params.term_name} 
                            course_id={params.course_id} course_name={params.course_name} />
            </Route>
            <Route path="/new_term">
                <NewTerm  on:message={triggerReload} />
            </Route>
            <Route path="/course/:term_id/:term_name/:id/:name" let:params>
                <Course id={params.id} name={params.name} term_id={params.term_id} term_name={params.term_name} />
            </Route>
            <Route path="/term/:id/:name" let:params>
                <Term id={params.id} name={params.name}  on:message={triggerReload} />
            </Route>
            <Route path="/course/edit/:term_id/:term_name/:id/:name" let:params>
                <CourseInfo id={params.id} name={params.name} term_id={params.term_id} term_name={params.term_name}
                            on:message={triggerReload}/>
            </Route>
            <Route path="/assign/edit/:term_id/:term_name/:course_id/:course_name/:id/:name" let:params>
                <Assign id={params.id} name={params.name} course_id={params.course_id} course_name={params.course_name}
                        term_id={params.term_id} term_name={params.term_name} />
            </Route>
          </div>
      </div>
  </Router>
</div>  

<style>
.homepage {
  margin-left: 50px;
  margin-top: 20px;
  overflow: scroll;
  height: 100vh;
  width: 83vw;
}    
</style>

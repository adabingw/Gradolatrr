<script>
// @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import { all, create} from "mathjs";

    import Button from "./Button.svelte";
    import { DEFAULT_GRADING } from "../constants/constants";
    import { tokenize } from "./utils.svelte";

    export let grading;
    export let variables;
    export let showModal;
    
    let edit_grading = false;
    let equation;
    let eq_error;
    const dispatch = createEventDispatcher();
    const config = { }
    const math = create(all, config);
    const parser = math.parser();

    function editGrading() {
        edit_grading = true;
    }

    function saveVariable() {
        if (equation == undefined) return;
        let result = tokenize(equation, variables);
        if (result.status) {
            let eq_temp = equation;
            for (let v of result.message) {
                parser.set(`${v}`, 1000);
            }

            try {
                parser.evaluate(eq_temp.replaceAll("#", 1));
            } catch(error) {
                console.error(error);
                eq_error = "syntax results in parser error";
                return;
            }

            eq_error = undefined;
            dispatch('message', {
                equation: equation
            });
        } else {
            eq_error = result.message;
            console.error("error in equation");
        }
    }

    function cancelVariable() {
        edit_grading = false;
        eq_error = undefined;
    }

    $: {
        if (!showModal) {
            edit_grading = false;
            equation = undefined;
            eq_error = undefined;
        }
    }

</script>

{#if grading == DEFAULT_GRADING}
<div>
    this course is currently graded by the default grading system:
    <div class="equation">
        {grading}
    </div>
    every item in a course is assumed to have equal weighting. <br />
</div>
{:else}
<div>
    this course is currently graded by the custom grading system: <br /><br />
    <div class="equation">
        {grading}
    </div>
</div>
{/if}
{#if edit_grading && variables != undefined && grading != undefined}
<div>
    <h3>a little explanation</h3>
        <ul>
            <li>all variables used to calculate must be of type num.</li>
            <li><span class="equation"><em>variable</em></span> must be a field in the item</li>
            <li>the equation represents the way to calculate the grade for ONE item</li>
            <li>the grade in the course is calculated by summing up the weighted value of all items</li>
            <!-- <li>square brackets <span class="equation">[<em>variable</em>]</span> 
                indicate the <em>variable</em> field of all items. </li>
            <li>use <span class="equation">sum([variable])</span> to sum the <em>variable</em> field of all items. </li> -->
            <li>use <span class="equation">#</span> to get the number of items</li>
            <li>individual variables represent an individual field of a specific row.</li>
            <li>
                examples: 
                <ol>
                    <li>(default) <span class="equation">mark / #</li>
                    <li><span class="equation">mark * (weight / 100)</li>
                </ol>
            </li>
        </ul>
        <textarea bind:value={equation} class="new-equation"/>
        {#if eq_error != undefined}
            <p class="alert">{eq_error}</p>
        {/if}
        <div class="grading-div">
            <i class="fa-solid fa-ban" on:message={cancelVariable}></i>
            <i class="fa-solid fa-floppy-disk" on:message={saveVariable}></i>
        </div>
    </div>
{:else} 
    <Button text="change grading scheme" on:message={editGrading} />
{/if}

<style>
.equation {
    margin-top: 15px;
    margin-bottom: 15px;
    text-align: center;
    font-family: 'EB Garamond', serif;
    font-size: 19px;
}

.new-equation {
    width: 95%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px;
}

textarea {
    resize: none;
}

.grading-div {
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
    margin-bottom: 15px;
}

.alert {
    color: red;
}
</style>

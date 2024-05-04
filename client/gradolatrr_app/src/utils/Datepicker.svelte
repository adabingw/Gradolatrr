<script>
    // https://svelte.dev/repl/c7bb378789264f04944e22e86ea96c72?version=4.2.0
    // allows picking multiple days
    import { createEventDispatcher, onMount } from 'svelte';
    import dayjs from 'dayjs';
    import 'dayjs/locale/en';

    import Modal from './Modal.svelte';

    export let dates;
    export let num;

    const dispatch = createEventDispatcher()
    let elModal // HTMLElement
    let showModal = false // true: show calendar
    const arrDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const currentDay = +dayjs().format('D') // 1..31
    const currentMonth = +dayjs().format('M') // 1..12
    const currentYear = +dayjs().format('YYYY') // 2021...
    let selectedMonth = +dayjs().format('M') // 1..12
    let selectedYear = +dayjs().format('YYYY') // 2021...
    let rows = initRows();

    // reactivity, on input changes
    $: dispatch('message', {
        data: dates
    })

    // life cycle
    onMount(() => {
        dayjs.locale('en') // use locale
        affectedRows()
    })

    function handleClickModal(e) {
        if (e.target === elModal) {
            showModal = false
        }
    }

    function initRows() {
        return [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ]
    }

    function affectedRows() {
        rows = initRows()
        const firstDayOfCurrentMonth = ucFirst(
            dayjs(selectedYear + '-' + selectedMonth)
                .startOf('month')
                .format('dd')
        )
        const lastDayOfCurrentMonth = +dayjs(selectedYear + '-' + selectedMonth)
        .endOf('month')
        .format('D') // 31
        let iRow = 0
        let iCol = 0
        let start = false
        let cpt = 0
        for (iRow = 0; iRow < 6; iRow++) {
            arrDays.forEach((daystr) => {
                if (cpt > lastDayOfCurrentMonth) return;
                if (!start && daystr === firstDayOfCurrentMonth) {
                    cpt++
                    start = true
                }
                rows[iRow][iCol] = cpt
                iCol++
                if (start) {
                    cpt++
                }
            })
            iCol = 0
        }
    }

    function ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function previousMonth() {
        selectedMonth--
        if (selectedMonth <= 0) {
            selectedMonth = 12
            selectedYear--
        }
        affectedRows()
    }

    function nextMonth() {
        selectedMonth++
        if (selectedMonth > 12) {
            selectedMonth = 1
            selectedYear++
        }
        affectedRows()
    }

    function selectDate(y, m, d) {
        let selected_day = dayjs(y + '-' + m + '-' + d).format('YYYY-MM-DD')
        // showModal = false;
        if (!dates.includes(selected_day)) {
            if (dates.length >= 10) {
                showModal = false;
                return;
            }
            dates = [...dates, selected_day];
            dates.sort(function(a, b) { 
                a = new Date(a);
                b = new Date(b);
                return a > b ? 1 : a < b ? -1 : 0;
            });
        } else {
            for (let i = 0; i < dates.length; i++) {
                if (dates[i] == selected_day) {
                    dates.splice(i, 1);
                }
            }
        }
        rows = rows;
        dates = dates;
    }

    function isInSelected(y, m, d) {
        let selected_day = dayjs(y + '-' + m + '-' + d).format('YYYY-MM-DD')
        if (dates.includes(selected_day)) return true;
        else return false;
    }

</script>

<Modal bind:showModal>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={elModal}
        on:click={handleClickModal} >
        <div class="calendar">
            <div>
            <div>
                <span>
                    {ucFirst(dayjs(selectedYear + '-' + selectedMonth).format('MMMM YYYY'))}
                </span>

                <div >
                <span on:click={previousMonth} aria-label="calendar backward">
                    <i class="fa-solid fa-chevron-left"></i>
                </span>
                <span on:click={nextMonth} aria-label="calendar forward">
                    <i class="fa-solid fa-chevron-right"></i>
                </span>
                </div>
            </div>

            <div>
                <table>
                <thead>
                    <tr>
                    {#each arrDays as day}
                        <th>{day}</th>
                    {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each rows as col}
                    <tr>
                        {#each col as i}
                        <td>
                            {#if i > 0}
                                {#if isInSelected(selectedYear, selectedMonth, i)}
                                <span on:click={() => {
                                        selectDate(selectedYear, selectedMonth, i)
                                    }} class="day selected-day">
                                    {i}
                                </span>
                                {:else if i === currentDay && selectedMonth === currentMonth && selectedYear === currentYear}
                                <span on:click={() => {
                                        selectDate(selectedYear, selectedMonth, i)
                                    }} class="day today">
                                    {i}
                                </span>
                                {:else}
                                <span class="day text-base text-gray-500 font-medium">
                                    <span class="border-none"
                                    on:click={() => {
                                        selectDate(selectedYear, selectedMonth, i)
                                    }}>
                                        {i}
                                    </span>
                                </span>
                                {/if}
                            {/if}
                        </td>
                        {/each}
                    </tr>
                    {/each}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
</Modal>
    
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => { showModal = true }} class="dates">
    {#each dates as date}
        <p class="date">{date}</p>
    {/each}
</div>

<style>
span {
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
}

i {
    margin-left: 5px;
    color: #818181 !important;
}

table {
    margin-top: 18px;
    width: 100%;
    text-align: center;
}    

td {
    width: 15px;
}

th {
    width: 15px;
    text-align: center;
}

.day {
    padding: 5px;
}

.selected-day {
    padding:4px;
    color: #968b6b;
    border: 1px solid #968b6b;
}

.today {
    padding:4px;
    background-color: #968b6b;
    color: white;
    border: 1px solid #968b6b;
}

tr {
    line-height: 30px;
}

.dates {
    font-size: 13px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid black;
    margin-top: 8px;
    margin-bottom: 8px;
    max-width: 350px;
    align-items: center;
    min-height: 50px;
}

.date {
    margin-left: 5px;
    margin-right: 5px;
}

.calendar {
    text-align: center;
}
</style>

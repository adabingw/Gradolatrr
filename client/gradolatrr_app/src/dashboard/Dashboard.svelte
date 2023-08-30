<script>
// @ts-nocheck

    import Modal from '../utils/Modal.svelte';
    import TagBlock from '../utils/TagBlock.svelte';

    let showModal = false;
    let properties = [["assignment", "#afc3e3"], ["final", "#debada"], ["midterm", "#c5deba"]];
    
    export let text;

</script>

<p>
    {text}
</p>
<button on:click={() => (showModal = true)}> show modal </button>

<Modal bind:showModal>
	<h2 slot="header">
		tags
		<!-- <small><em>adjective</em> mod·al \ˈmō-dəl\</small> -->
	</h2>
    <TagBlock properties={properties} />

	<!-- <ol class="definition-list">
		<li>of or relating to modality in logic</li>
		<li>
			containing provisions as to the mode of procedure or the manner of taking effect —used of a
			contract or legacy
		</li>
		<li>of or relating to a musical mode</li>
		<li>of or relating to structure as opposed to substance</li>
		<li>
			of, relating to, or constituting a grammatical form or category characteristically indicating
			predication
		</li>
		<li>of or relating to a statistical mode</li>
	</ol> -->
</Modal>

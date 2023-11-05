<script lang="ts">
	import { onMount } from 'svelte';
	import MyQuran from '../../entities/MyQuran';
	import type API from '../../contracts/API';
	import type Location from '../../contracts/Location';
	import { goto } from '$app/navigation';

	let data: API = new MyQuran();
    export let keyword: string = "";
    export let is_loading: boolean = false;
	export let dataLocation: Location[] = [];
    let filterdData: Location[];
    $: filterdData = dataLocation.filter(
        val => val.location.toLocaleLowerCase().includes(keyword))
	onMount(async () => {
        is_loading = true;
		dataLocation = await data.getListLokasi();
        is_loading = false
	});
    export function goTo(id: String) {
        goto(`/?code=${id}`)
    }
</script>
<div class="card bg-neutral text-neutral-content my-3 sticky top-0 z-10">
    <div class="card-body items-center text-center">
        <input type="text" bind:value={keyword} placeholder="Type here" class="input input-bordered w-full py-3" />
    </div>
</div>
<div class="overflow-x-auto">
    {#if !is_loading}
	<table class="table">
		<!-- head -->
		<tbody>
            {#if filterdData.length > 0}
                {#each filterdData as {id, location}}
                    <tr class="hover cursor-pointer" on:click={() => goTo(id)}>
                        <td class="capitalize text-xl">{id}</td>
                        <td class="text-right text-xl">{location}</td>
                    </tr>
                {/each}
            {/if}
		</tbody>
	</table>
    {:else}
		<p class="text-center"><span class="loading loading-spinner loading-lg" /></p>
	{/if}
</div>
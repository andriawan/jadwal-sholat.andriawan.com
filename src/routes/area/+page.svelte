<script lang="ts">
	import { onMount } from 'svelte';
	import type API from '../../contracts/API';
	import type Location from '../../contracts/Location';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Aladhan from '../../entities/Aladhan';
	import QueryString from 'qs';

	let data: API = Aladhan.getInstance();
	export let keyword: string = '';
	export let is_loading: boolean = false;
	export let dataLocation: Location[] = [];
	let filteredData: Location[];
	$: filteredData = dataLocation.filter((val) =>
		val.location.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
	);
	onMount(async () => {
		is_loading = true;
		dataLocation = await data.getListLokasi();
		is_loading = false;
	});
	export function goTo({ id, lat, long, location }: Location) {
		const query = QueryString.stringify({
			code: id,
			lat,
			long,
			refresh: 1,
			distric_name: location,
			tab: $page.url.searchParams.get('tab') ?? 'BULANAN'
		});
		goto(`/?${query}`);
	}
	function setKeyword(event: Event) {
		let el: HTMLInputElement = event.target as HTMLInputElement;
		keyword = el.value;
	}
</script>

<div class="card bg-neutral text-neutral-content my-3 sticky top-0 z-10">
	<div class="card-body items-center text-center">
		<input
			type="text"
			value={keyword}
			on:input={setKeyword}
			placeholder="Ketikan kata kunci..."
			class="input input-bordered w-full py-3"
		/>
	</div>
</div>
<div class="overflow-x-auto">
	{#if !is_loading}
		<table class="table">
			<!-- head -->
			<tbody>
				{#if filteredData.length > 0}
					{#each filteredData as filtered}
						<tr class="hover cursor-pointer" on:click={() => goTo(filtered)}>
							<td class="capitalize text-xl">
								<span class="badge badge-accent">{filtered.id}</span>
							</td>
							<td class="text-right text-xl">{filtered.location}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{:else}
		<p class="text-center"><span class="loading loading-spinner loading-lg" /></p>
	{/if}
</div>

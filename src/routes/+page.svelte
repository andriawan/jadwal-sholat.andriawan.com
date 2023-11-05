<script lang="ts">
	import { onMount } from 'svelte';
	import MyQuran from '../entities/MyQuran';
	import type Schedule from '../contracts/Schedule';
	import type API from '../contracts/API';
	import { page } from '$app/stores';
	import Header from '../components/Header.svelte';
	import TablePrayer from '../components/TablePrayer.svelte';
	import Footer from '../components/Footer.svelte';

	let data: API = new MyQuran();
	let schedule: Schedule;
	let scheduleNextDay: Schedule;
	let selectedCode: string = '1301';
	let currentParyer: string;
	let nextPrayer: string;

	export function setCurrentPrayer(current: CustomEvent) {
		currentParyer = current.detail?.currentParyer;
	}

	export function setNextPrayer(current: CustomEvent) {
		nextPrayer = current.detail?.nextPrayer;
	}

	export async function loadPrayer(date: number) {
		return await data.getPrayerSchedule({
			id: selectedCode,
			year: new Date().getFullYear().toString(),
			month: new Date().getMonth().toString(),
			date: date.toString()
		});
	}

	onMount(async () => {
		selectedCode = $page.url.searchParams.get('code') ?? selectedCode;
		schedule = await loadPrayer(new Date().getDate());
		scheduleNextDay = await loadPrayer(new Date().getDate() + 1);
	});
</script>

<Header
	{schedule}
	{scheduleNextDay}
	on:update:current-prayer={setCurrentPrayer}
	on:update:next-prayer={setNextPrayer}
/>
{#if schedule}
	<TablePrayer {nextPrayer} {schedule} {currentParyer} />
{:else}
	<p class="text-center"><span class="loading loading-spinner loading-lg" /></p>
{/if}
<Footer {data} />

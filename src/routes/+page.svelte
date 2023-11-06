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
		checkDayChange();
	}

	export async function loadPrayer(date: number) {
		let now = new Date();
		let month: number = now.getMonth() + 1;
		let year: number = now.getFullYear();
		return await data.getPrayerSchedule({
			id: selectedCode,
			year: year.toString(),
			month: month.toString(),
			date: date.toString()
		});
	}

	async function checkDayChange() {
		schedule = await loadPrayer(new Date().getDate());
		let timezoneOffset = (new Date().getTimezoneOffset() ?? 0) / -60;
		let isNegative = timezoneOffset < 0 ? '-' : '+';
		let absTimezone = Math.abs(timezoneOffset);
		let textSavedParsing = `${schedule.date.date} 00:00:00 GMT${isNegative}${
			absTimezone < 9 ? `0${absTimezone}:00` : `${absTimezone}:00`
		}`;
		let savedTime = Date.parse(textSavedParsing);
		let now = new Date();
		let month: number = now.getMonth() + 1;
		let year: number = now.getFullYear();
		let date = now.getDate();
		let textNowParsing = `${year}-${month}-${date < 9 ? `0${date}` : ''} 00:00:00 GMT${isNegative}${
			absTimezone < 9 ? `0${absTimezone}:00` : `${absTimezone}:00`
		}`;
		let nowTime = Date.parse(textNowParsing);
		let needReload = nowTime > savedTime;
		if (needReload) {
			localStorage.removeItem('getPrayerSchedule');
			schedule = await loadPrayer(new Date().getDate());
			scheduleNextDay = await loadPrayer(new Date().getDate() + 1);
		}
	}

	onMount(async () => {
		selectedCode = $page.url.searchParams.get('code') ?? selectedCode;
		checkDayChange();
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

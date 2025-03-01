<script lang="ts">
	import { onMount } from 'svelte';
	import type Schedule from '../contracts/Schedule';
	import { page } from '$app/stores';
	import Header from '../components/Header.svelte';
	import TablePrayer from '../components/TablePrayer.svelte';
	import Footer from '../components/Footer.svelte';
	import { goto } from '$app/navigation';
	import Calendar from '../entities/Calendar';
	import type PrayerTimesAPI from '../contracts/API';
	import type Time from '../contracts/Time';
	import DateFnsTime from '../entities/DateFnsTime';
	import { id } from 'date-fns/locale';
	import IndonesiaHijriMapper from '../entities/IndonesiaHijriMapper';
	import TablePrayerMonthly from '../components/TablePrayerMonthly.svelte';
	import Aladhan from '../entities/Aladhan';

	let api: PrayerTimesAPI = Aladhan.getInstance();
	let hijri: Calendar = Calendar.getInstance();
	let timeManager: Time = DateFnsTime.getInstance(new Date(), id);
	let schedule: Schedule;
	let monthlySchedule: Schedule[];
	let scheduleNextDay: Schedule;
	let selectedCode: string = '1301';
	let currentParyer: string;
	let nextPrayer: string;
	let hijriDate: string;
	let hijriMonth: string;
	let tab = 'HARIAN';

	// Jakarta Lat Long
	let lat = '-8.1844859';
	let long = '113.6680747';
	let districsName = 'Jakarta';

	export function setCurrentPrayer(current: CustomEvent) {
		currentParyer = current.detail?.currentParyer;
	}

	export function setNextPrayer(current: CustomEvent) {
		nextPrayer = current.detail?.nextPrayer;
		checkDayChange();
	}

	export async function loadPrayerSchedule(date: number) {
		let now = new Date();
		let month: number = now.getMonth() + 1;
		let year: number = now.getFullYear();
		return await api.getPrayerSchedule({
			id: selectedCode,
			year: year.toString(),
			month: month.toString(),
			date: date.toString(),
			lat: lat,
			long: long,
			location: districsName
		});
	}

	export async function loadPrayerScheduleList() {
		let now = new Date();
		let month: number = now.getMonth() + 1;
		let year: number = now.getFullYear();
		return await api.getPrayerScheduleList({
			id: selectedCode,
			year: year.toString(),
			month: month.toString(),
			lat: lat,
			long: long
		});
	}

	async function checkDayChange() {
		let dateFormat = timeManager.format('dd-MM-yyyy', timeManager.getTodayDate());
		let dataHijri = await hijri.getHijriCalendar(dateFormat);
		hijriMonth = hijri.mapHijriMonth(new IndonesiaHijriMapper(), Number(dataHijri.month));
		let forceClear: boolean = $page.url.searchParams.get('refresh') === '1' ? true : false;

		hijriDate = `${dataHijri.day} ${hijriMonth} ${dataHijri.year}`;
		if (forceClear) {
			const newUrl = new URL($page.url);
			newUrl?.searchParams?.delete('refresh');
			goto(newUrl);
		}
		schedule = await loadPrayerSchedule(new Date().getDate());
		scheduleNextDay = await loadPrayerSchedule(new Date().getDate() + 1);
		monthlySchedule = await loadPrayerScheduleList();
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
		let textNowParsing = `${year}-${month}-${
			date < 9 ? `0${date}` : date
		} 00:00:00 GMT${isNegative}${absTimezone < 9 ? `0${absTimezone}:00` : `${absTimezone}:00`}`;
		let nowTime = Date.parse(textNowParsing);
		let needReload = nowTime > savedTime;
		if (needReload) {
			localStorage.clear();
			schedule = await loadPrayerSchedule(new Date().getDate());
			scheduleNextDay = await loadPrayerSchedule(new Date().getDate() + 1);
			monthlySchedule = await loadPrayerScheduleList();
			hijriMonth = hijri.mapHijriMonth(new IndonesiaHijriMapper(), Number(dataHijri.month));
		}
	}

	onMount(async () => {
		selectedCode = $page.url.searchParams.get('code') ?? selectedCode;
		checkDayChange();
		tab = $page.url.searchParams.get('tab') ?? 'HARIAN';
		lat = $page.url.searchParams.get('lat') ?? lat;
		long = $page.url.searchParams.get('long') ?? long;
		districsName = $page.url.searchParams.get('distric_name') ?? districsName;
	});
</script>

<Header
	{schedule}
	{scheduleNextDay}
	{hijriDate}
	{hijriMonth}
	stateTab={tab}
	on:tab:update={(event) => (tab = event.detail)}
	on:update:current-prayer={setCurrentPrayer}
	on:update:next-prayer={setNextPrayer}
/>
{#if schedule && tab === 'HARIAN'}
	<TablePrayer {nextPrayer} {schedule} {currentParyer} />
{:else if monthlySchedule && tab === 'BULANAN'}
	<TablePrayerMonthly todaySchedule={schedule} schedule={monthlySchedule} />
{:else}
	<div class="flex w-full py-6 px-4 flex-col gap-6">
		{#each Array(8) as _, i}
			<div class="flex items-center">
				<div class="skeleton h-6 w-[25%]" />
				<div class="flex-1" />
				<div class="skeleton h-6 w-[25%]" />
			</div>
		{/each}
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte';
	import MyQuran from '../entities/MyQuran';
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

	let data: PrayerTimesAPI = MyQuran.getInstance();
	let hijri: Calendar = Calendar.getInstance();
	let timeManager: Time = DateFnsTime.getInstance(new Date(), id);
	let schedule: Schedule;
	let scheduleNextDay: Schedule;
	let selectedCode: string = '1301';
	let currentParyer: string;
	let nextPrayer: string;
	let hijriDate: string;

	export function setCurrentPrayer(current: CustomEvent) {
		currentParyer = current.detail?.currentParyer;
	}

	export function setNextPrayer(current: CustomEvent) {
		nextPrayer = current.detail?.nextPrayer;
		checkDayChange();
	}

	export async function loadPrayerSchedule(
		date: number,
		additionalId: string = '',
		forceClear: boolean = false
	) {
		let now = new Date();
		let month: number = now.getMonth() + 1;
		let year: number = now.getFullYear();
		return await data.getPrayerSchedule({
			id: selectedCode,
			year: year.toString(),
			month: month.toString(),
			date: date.toString(),
			additionalId,
			forceClear
		});
	}

	async function checkDayChange() {
		let dateFormat = timeManager.format('dd-MM-yyyy', timeManager.getTodayDate());
		let dataHijri = await hijri.getHijriCalendar(dateFormat);
		let hijriMonth = hijri.mapHijriMonth(new IndonesiaHijriMapper(), Number(dataHijri.month));
		let forceClear: boolean = $page.url.searchParams.get('refresh') === '1' ? true : false;
		
		hijriDate = `${dataHijri.day} ${hijriMonth} ${dataHijri.year}`;
		if (forceClear) {
			const newUrl = new URL($page.url);
			newUrl?.searchParams?.delete('refresh');
			goto(newUrl);
		}
		schedule = await loadPrayerSchedule(new Date().getDate(), '', forceClear);
		scheduleNextDay = await loadPrayerSchedule(new Date().getDate() + 1, 'next', forceClear);
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
		let textNowParsing = `${year}-${month}-${date < 9 ? `0${date}` : date} 00:00:00 GMT${isNegative}${
			absTimezone < 9 ? `0${absTimezone}:00` : `${absTimezone}:00`
		}`;
		let nowTime = Date.parse(textNowParsing);
		let needReload = nowTime > savedTime;
		if (needReload) {
			localStorage.clear();
			schedule = await loadPrayerSchedule(new Date().getDate(), '', true);
			scheduleNextDay = await loadPrayerSchedule(new Date().getDate() + 1, 'next', true);
			hijriMonth = hijri.mapHijriMonth(new IndonesiaHijriMapper(), Number(dataHijri.month));
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
	{hijriDate}
	on:update:current-prayer={setCurrentPrayer}
	on:update:next-prayer={setNextPrayer}
/>
{#if schedule}
	<TablePrayer {nextPrayer} {schedule} {currentParyer} />
{:else}
	<p class="text-center"><span class="loading loading-spinner loading-lg" /></p>
{/if}
<Footer {data} />

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type Schedule from '../contracts/Schedule';
	import type PrayerSchedule from '../contracts/PrayerSchedule';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let nextPrayer: string = '';
	let nextParyerTime: string = '';
	let currentParyer: string = '';
	let currentParyerMilli: number = 0;
	let currentHours = '00';
	let currentMinute = '00';
	let diffPrayer: string = '';
	// props
	export let schedule: Schedule;
	export let scheduleNextDay: Schedule;
	export let hijriDate: string;

	export let stateTab = 'HARIAN';

	let timeMapping: PrayerSchedule = {
		subuh: 'dzuhur',
		dzuhur: 'ashar',
		ashar: 'maghrib',
		maghrib: 'isya',
		isya: 'subuh',
		imsak: 'subuh',
		terbit: 'dzuhur',
		dhuha: 'dzuhur'
	};
	let dispatch = createEventDispatcher();
	let intervalContainer: string | number | NodeJS.Timeout | undefined;

	function getTimeDiff(diff: number) {
		let labelHours = '';
		let labelMinutes = '';
		const timeDifference: number = Math.abs(diff);
		const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutesDifference = Math.ceil((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

		labelHours = hoursDifference > 0 ? `${hoursDifference} Jam` : labelHours;
		labelMinutes = minutesDifference > 0 ? ` ${minutesDifference} menit lagi` : labelMinutes;

		if (!labelMinutes) labelMinutes = ' lagi';

		return `${labelHours}${labelMinutes}`;
	}
	function processComparationTime(val: string[], comparation: Date) {
		let time = val[1] as string;
		let now = new Date();
		let [hours, minute] = time.split(':');
		let hoursInt: number = parseInt(hours);
		let minuteInt: number = parseInt(minute);
		comparation.setHours(hoursInt, minuteInt);
		let miliNow = now.getTime();
		let miliComparation = comparation.getTime();
		return [miliNow, miliComparation];
	}

	function setFuturePrayerSchedule() {
		let comparation = new Date();

		Object.entries(schedule?.schedule).forEach((val) => {
			let [miliNow, miliComparation] = processComparationTime(val, new Date());

			if (miliNow >= miliComparation && currentParyerMilli <= miliComparation) {
				currentParyer = val[0];
				currentParyerMilli = miliComparation;
				dispatch('update:current-prayer', {
					currentParyer,
					currentParyerMilli
				});
			}
		});

		nextPrayer = timeMapping[currentParyer as keyof PrayerSchedule];
		nextParyerTime = schedule.schedule[nextPrayer as keyof PrayerSchedule];
		if (currentParyer === 'isya') {
			nextParyerTime = scheduleNextDay.schedule.subuh;
			comparation.setDate(new Date().getDate() + 1);
		}
		let [now, comparationData] = processComparationTime([nextPrayer, nextParyerTime], comparation);
		diffPrayer = getTimeDiff(now - comparationData);
		dispatch('update:next-prayer', {
			nextParyerTime,
			nextPrayer,
			diffPrayer
		});
	}

	function setTime(date: Date) {
		currentHours = date.getHours().toString();
		currentMinute = date.getMinutes().toString();
		currentHours = currentHours.length < 2 ? '0'.concat(currentHours) : currentHours;
		currentMinute = currentMinute.length < 2 ? '0'.concat(currentMinute) : currentMinute;
	}

	onMount(async () => {
		intervalContainer = setInterval(() => {
			setFuturePrayerSchedule();
			setTime(new Date());
		}, 1000);
	});

	onDestroy(async () => {
		clearInterval(intervalContainer);
	});
</script>

<div class="card rounded-none md:rounded-lg bg-neutral text-neutral-content md:my-3">
	<div class="flex justify-end flex-1 absolute right-0">
		<div class="flex items-stretch">
			<details class="dropdown dropdown-end">
				<summary class="btn btn-ghost px-0">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"
						><path
							fill="currentColor"
							d="M156 128a28 28 0 1 1-28-28a28 28 0 0 1 28 28Zm-28-52a28 28 0 1 0-28-28a28 28 0 0 0 28 28Zm0 104a28 28 0 1 0 28 28a28 28 0 0 0-28-28Z"
						/></svg
					>
				</summary>
				<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 w-52">
					<li><a href={`/area?tab=${stateTab}`}>Ganti Daerah</a></li>
				</ul>
			</details>
		</div>
	</div>
	<div class="card-body items-center text-center">
		<h2 class="card-title text-sm">
			{schedule?.date.full_date ?? 'Loading...'}
			({hijriDate})
		</h2>
		<h2 class="text-sm">
			masuk waktu <span class="capitalize">{currentParyer ? currentParyer : 'Loading...'}</span> di {schedule?.location ??
				'Loading...'}
		</h2>
		<h1 class="text-6xl animate-pulse">{currentHours}:{currentMinute}</h1>
		<h1 class="text-sm md:text-lg">
			<span class="badge badge-accent">{diffPrayer ? diffPrayer : '0 jam, 0 menit'}</span> menuju
			<span class="capitalize badge badge-info"
				>{!['terbit', 'imsak'].includes(nextPrayer)
					? `sholat ${nextPrayer ? nextPrayer : 'Loading...'}`
					: nextPrayer
					? nextPrayer
					: 'Loading...'}</span
			>
		</h1>
	</div>
	<div class="tabs">
		<button
			on:click={() => {
				stateTab = 'HARIAN';
				dispatch('tab:update', 'HARIAN');
				$page.url.searchParams.set('tab', 'HARIAN');
				goto(`?${$page.url.searchParams.toString()}`);
			}}
			class={`flex-1 tab tab-bordered ${stateTab === 'HARIAN' ? 'tab-active' : ''}`}>Harian</button
		>
		<button
			on:click={() => {
				stateTab = 'BULANAN';
				dispatch('tab:update', 'BULANAN');
				$page.url.searchParams.set('tab', 'BULANAN');
				goto(`?${$page.url.searchParams.toString()}`);
			}}
			class={`flex-1 tab tab-bordered ${stateTab === 'BULANAN' ? 'tab-active' : ''}`}
			>Bulanan</button
		>
	</div>
</div>

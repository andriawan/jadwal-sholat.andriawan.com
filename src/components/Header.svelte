<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type Schedule from '../contracts/Schedule';
	let nextPrayer: string = '';
	let nextParyerTime: string = '';
	let currentParyer: string = '';
	export let currentParyerMilli: number = 0;
	let currentHours = '00';
	let currentMinute = '00';
	export let diffPrayer: string = '';
	export let schedule: Schedule;
	export let scheduleNextDay: Schedule;
	let dispatch = createEventDispatcher();
	let intervalContainer: string | number | NodeJS.Timeout | undefined;

	function getTimeDiff(diff: number) {
		let labelHours = '';
		let labelMinutes = '';
		const timeDifference: number = Math.abs(diff);
		const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

		labelHours = hoursDifference > 0 ? `${hoursDifference} Jam` : labelHours;
		labelMinutes = minutesDifference > 0 ? ` ${minutesDifference} menit lagi` : labelMinutes;

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

	export function setFuturePrayerSchedule() {
		Object.entries(schedule?.schedule).forEach((val) => {
			let [miliNow, miliComparation] = processComparationTime(val, new Date());
			if (miliNow < miliComparation) {
				nextPrayer = val[0];
				nextParyerTime = val[1];
				diffPrayer = getTimeDiff(miliComparation - miliNow);
				dispatch('update:next-prayer', {
					nextParyerTime,
					nextPrayer,
					diffPrayer
				});
				return;
			}

			if (miliNow >= miliComparation && currentParyerMilli <= miliComparation) {
				currentParyer = val[0];
				currentParyerMilli = miliComparation;
				dispatch('update:current-prayer', {
					currentParyer,
					currentParyerMilli
				});
			}

			if (currentParyer === 'isya') {
				nextPrayer = 'subuh';
				nextParyerTime = scheduleNextDay.schedule.subuh;
				let comparation = new Date();
				comparation.setDate(new Date().getDate() + 1);
				let [miliNow, miliComparation] = processComparationTime(
					['shubuh', scheduleNextDay.schedule.subuh],
					comparation
				);
				diffPrayer = getTimeDiff(miliNow - miliComparation);
				dispatch('update:next-prayer', {
					nextParyerTime,
					nextPrayer,
					diffPrayer
				});
			}
		});
	}

	onMount(async () => {
		intervalContainer = setInterval(() => {
			setFuturePrayerSchedule();
			currentHours = new Date().getHours().toString();
			currentMinute = new Date().getMinutes().toString();
			console.log(currentHours)
		}, 1000);
	});

	onDestroy(async () => {
		clearInterval(intervalContainer);
	})
</script>

<div class="card rounded-none md:rounded-lg bg-neutral text-neutral-content md:my-3">
	<div class="card-body items-center text-center">
		<h2 class="card-title text-lg">
			{schedule?.date.full_date ?? 'Loading...'}
			{currentHours}:{currentMinute}
		</h2>
		<h2 class="text-sm">
			masuk waktu <span class="capitalize">{currentParyer ? currentParyer : 'Loading...'}</span> di {schedule?.location ??
				'Loading...'}
		</h2>
		<h1 class="text-6xl animate-pulse">{nextParyerTime ? nextParyerTime : '00:00'}</h1>
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
		<button on:click={() => goto('/area')} class="btn text-info btn-link">Ganti Daerah</button>
	</div>
</div>

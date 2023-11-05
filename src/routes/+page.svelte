<script lang="ts">
	import { onMount } from 'svelte';
	import MyQuran from '../entities/MyQuran';
	import type Schedule from '../contracts/Schedule';
	import type API from '../contracts/API';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let data: API = new MyQuran();
	export let schedule: Schedule;
	export let selectdCode: String = '1301';
	export let nextPrayer: string = '';
	export let nextParyerTime: string = '';
	export let currentParyer: string = '';
	export let currentParyerMilli: number = 0;
	export let diffPrayer: string = '';
	export async function loadPrayer() {
		schedule = await data.getPrayerSchedule({
			id: selectdCode,
			year: new Date().getFullYear().toString(),
			month: new Date().getMonth().toString(),
			date: new Date().getDate().toString()
		});
	}
	function getTimeDiff(diff: number) {
		let labelHours = '';
		let labelMinutes = '';
		const timeDifference: number = Math.abs(diff);

		// Convert the time difference to hours, minutes, and seconds
		const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

		labelHours = hoursDifference > 0 ? `${hoursDifference} Jam, ` : labelHours;
		labelMinutes = minutesDifference > 0 ? `${minutesDifference} menit lagi` : labelMinutes;

		return `${labelHours}${labelMinutes}`;
	}
	export function setFuturePrayerSchedule() {
		let now = new Date();
		Object.entries(schedule?.schedule).forEach((val) => {
			let time = val[1] as string;
			let [hours, minute] = time.split(':');
			let hoursInt: number = parseInt(hours);
			let minuteInt: number = parseInt(minute);
			let comparation = new Date();
			comparation.setHours(hoursInt, minuteInt);
			let miliNow = now.getTime();
			let miliComparation = comparation.getTime();
			if (miliNow < miliComparation && !nextPrayer) {
				nextPrayer = val[0];
				nextParyerTime = val[1]
				diffPrayer = getTimeDiff(miliComparation - miliNow);
				return;
			}

			if (miliNow >= miliComparation && currentParyerMilli <= miliComparation) {
				currentParyer = val[0];
				currentParyerMilli = miliComparation;
			}
		});
	}
	onMount(async () => {
		selectdCode = $page.url.searchParams.get('code') ?? selectdCode;
		await loadPrayer();
		setInterval(() => {
			setFuturePrayerSchedule();
		}, 1000);
	});
</script>

<div class="card bg-neutral text-neutral-content my-3">
	<div class="card-body items-center text-center">
		<h2 class="card-title text-lg">{schedule?.date.full_date ?? 'Loading...'}</h2>
		<h2 class="text-sm">
			masuk waktu <span class="capitalize">{currentParyer ? currentParyer : 'Loading...'}</span> di {schedule?.location ??
				'Loading...'}
		</h2>
		<h1 class="text-6xl animate-pulse">{nextParyerTime ?? '00:00'}</h1>
		<h1 class="text-lg">
			{diffPrayer ? diffPrayer : '0 jam, 0 menit'} menuju
			<span class="capitalize"
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
<div class="overflow-x-auto">
	{#if schedule}
		<table class="table">
			<!-- head -->
			<tbody>
				{#each Object.entries(schedule?.schedule) as [key, value]}
					<tr
						class="hover {key === nextPrayer ? 'bg-info-content' : ''} {key === currentParyer
							? 'bg-success-content animate-pulse'
							: ''}"
					>
						<td class="capitalize text-xl">{key}</td>
						<td class="text-right text-xl">{value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="text-center"><span class="loading loading-spinner loading-lg" /></p>
	{/if}
	<div class="py-2">
		<p class="italic text-center text-sm">
			data API retrieved from <a href="https://api.myquran.com" class="link link-info"
				>https://api.myquran.com</a
			>
		</p>
	</div>
</div>

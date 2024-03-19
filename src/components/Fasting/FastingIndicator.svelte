<script lang="ts">
	import { onMount } from 'svelte';
	import type Schedule from '../../contracts/Schedule';
	import CommonService from '../../services/CommonService';

	export let schedule: Schedule;
	let diffFasting: string = '';
	let percentageFasting: number = 0;
	let commonService = new CommonService();

	function setTimeDiffFasting(schedule: Schedule) {
		let startFasting = schedule.schedule.subuh;
		let endFasting = schedule.schedule.maghrib;
		let comparation = new Date();
		let now = new Date();
		let startComparation = new Date();
		let endComparation = new Date();
		let [hours, minute] = startFasting.split(':');
		let [hoursEnd, minuteEnd] = endFasting.split(':');

		startComparation.setHours(parseInt(hours), parseFloat(minute), 0, 0);
		endComparation.setHours(parseInt(hoursEnd), parseFloat(minuteEnd), 0, 0);

		let [nowFasting, comparationDataFasting] = commonService.processComparationTime(
			[startFasting, endFasting],
			comparation
		);
		let diff = endComparation.getTime() - startComparation.getTime();
		let nowDiff = now.getTime() - startComparation.getTime();
		diffFasting = commonService.generateTimeDiff(nowFasting - comparationDataFasting);
		percentageFasting = Math.floor((nowDiff / diff) * 100);
	}

	onMount(async () => {
		setTimeDiffFasting(schedule);
	});
</script>

<div class="pt-2 w-full">
	<h1 class="text-lg">
		Buka Puasa <span class="badge badge-accent">{diffFasting ? diffFasting : '0 Jam, 0 Menit'}</span
		>
	</h1>
	<progress class="progress progress-accent" value={percentageFasting} max="100" />
	<p>{percentageFasting}%</p>
</div>

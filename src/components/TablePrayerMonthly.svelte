<script lang="ts">
	import type Schedule from '../contracts/Schedule';
	export let schedule: Schedule[];
	export let todaySchedule: Schedule;
	let styleToday = 'text-white bg-teal-300 dark:bg-success-content dark:text-neutral-content';
</script>

<div class="overflow-x-auto h-[55vh]">
	<table class="table table-xs table-pin-rows table-pin-cols">
		<thead>
			<tr>
				<th>Tanggal</th>
				<td>Imsak</td>
				<td>Subuh</td>
				<td>Dhuha</td>
				<td>Dzuhur</td>
				<td>Ashar</td>
				<td>Maghrib</td>
				<td>Isya</td>
			</tr>
		</thead>
		<tbody>
			{#each schedule as dataSchedule}
				<tr
					id={dataSchedule.date.date}
					class={`hover ${
						todaySchedule.date.date === dataSchedule.date.date ? styleToday + ' animate-pulse' : ''
					}`}
				>
					<th
						class={`capitalize ${
							todaySchedule.date.date === dataSchedule.date.date ? styleToday : ''
						}`}><p class="min-w-[80px] text-xs">{dataSchedule.date.full_date}</p></th
					>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.imsak}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.subuh}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.dhuha}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.dzuhur}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.ashar}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.maghrib}</span
						>
					</td>
					<td class="text-right">
						<span class="badge text-md badge-accent min-w-[110px]"
							>{dataSchedule.schedule.isya}</span
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

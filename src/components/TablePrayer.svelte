<script lang="ts">
	import type Schedule from '../contracts/Schedule';
	export let schedule: Schedule;
	export let nextPrayer: string;
	export let currentParyer: string;
</script>

<div class="overflow-x-auto">
	<table class="table">
		<tbody>
			{#each Object.entries(schedule?.schedule) as [key, value]}
				<tr
					class="hover {key === nextPrayer
						? 'bg-info dark:text-white'
						: ''} {key === currentParyer
						? 'text-white bg-success animate-pulse'
						: ''}"
				>
					<td class="capitalize text-xl">{key}</td>
					<td class="text-right">
						<span class="badge text-md badge-accent">{value}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

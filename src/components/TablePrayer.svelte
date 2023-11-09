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
					class="hover {key === nextPrayer ? 'dark:bg-info-content bg-blue-500 dark:text-neutral-content text-white' : ''} {key === currentParyer
						? 'text-white bg-teal-300 dark:bg-success-content dark:text-neutral-content animate-pulse'
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

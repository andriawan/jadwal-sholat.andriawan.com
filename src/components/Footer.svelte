<script lang="ts">
	import type API from '../contracts/API';

	export let data: API;
</script>

<div class="py-2">
	<p class="italic text-center text-sm">
		data API retrieved from <a href={data.getFullUrl()} class="link link-info"
			>{data.getFullUrl()}</a
		>
	</p>
	{#if data.getSourceLink()}
		<p class="italic text-center text-sm">
			source code : <a href={data.getSourceLink()} class="link link-info">{data.getSourceLink()}</a>
		</p>
	{/if}
</div>

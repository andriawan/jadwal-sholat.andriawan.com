<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from '../../components/Footer.svelte';
	import type PrayerTimesAPI from '../../contracts/API';
	import Aladhan from '../../entities/Aladhan';
	import { page } from '$app/stores';

	let api: PrayerTimesAPI | Aladhan = Aladhan.getInstance();
	let queryParams: string = '';
	onMount(async () => {
		queryParams = $page.url.searchParams.toString();
	});
</script>

<div
	class="card rounded-none md:rounded-lg bg-neutral h-screen flex items-center justify-center text-neutral-content md:my-3"
>
	<Footer data={api} />
	<a href={`/?${queryParams}`} class="link link-info">back to home</a>
</div>

<script lang="ts">
	import { onMount } from "svelte";
    import MyQuran from "../entities/MyQuran";
	import type Schedule from "../contracts/Schedule";
	import type API from "../contracts/API";
	import type Location from "../contracts/Location";

    let data: API = new MyQuran();
    export let schedule: Schedule;
    export let dataLocation: Location[] = [];
    export let selectdCode: String = "1906";
    export function loadPrayer() {
        data.getPrayerSchedule({
            id: selectdCode,
            year: new Date().getFullYear().toString(),
            month: new Date().getMonth().toString(),
            date: new Date().getDate().toString()
        }).then(val => schedule = val)
    }
    onMount(() => {
        data.getListLokasi().then(lokasi => {
            dataLocation = lokasi
        });
        data.getPrayerSchedule({
            id: "1906",
            year: new Date().getFullYear().toString(),
            month: new Date().getMonth().toString(),
            date: new Date().getDate().toString()
        }).then(val => schedule = val)
    })

</script>
<select bind:value={selectdCode} on:change={loadPrayer} class="select select-success w-full max-w-xs">
    {#each dataLocation as { id, location }, i}
        <option value="{id}">{id} {location}</option>
    {/each}
</select>
<div class="mockup-code">
    <pre data-prefix="$"><code>{JSON.stringify(schedule)}</code></pre>
  </div>
<button class="btn btn-neutral">Neutral</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

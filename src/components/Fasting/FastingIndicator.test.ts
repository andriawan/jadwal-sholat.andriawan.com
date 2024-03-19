import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import FastingIndicator from './FastingIndicator.svelte';

test('render progress bar', () => {
	render(FastingIndicator, {
		schedule: {
			schedule: {
				ashar: '10:00',
				subuh: '04:11',
				dzuhur: '12:00',
				terbit: '06:00',
				dhuha: '06:00',
				imsak: '04:00',
				maghrib: '17:33',
				isya: '18:40'
			},
			area: 'Jember',
			coordinate: { bujur: '', lintang: '', lat: '', long: '' },
			date: { date: '06-06-2020', full_date: '06-06-2020' },
			id: '1',
			location: 'Jember'
		}
	});
	const greeting = screen.queryByText(/Buka Puasa/iu);
	screen.debug();
	expect(greeting).toBeInTheDocument();
});

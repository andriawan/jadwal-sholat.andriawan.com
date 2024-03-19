import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import CommonService from './CommonService';

describe('Common Service Test', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('return empty diff 0', () => {
		const commonService = new CommonService();
		const diff = commonService.generateTimeDiff(0);
		expect(diff).empty;
	});

	test('calculate diff time hours and minutes correctly', () => {
		const commonService = new CommonService();
		const diff = commonService.generateTimeDiff(3_700_000);
		expect(diff).not.empty;
		expect(diff).eq('1 Jam 1 menit lagi');
	});

	test('calculate diff time minutes correctly', () => {
		const commonService = new CommonService();
		const diff = commonService.generateTimeDiff(700_000);
		expect(diff).not.empty;
		expect(diff).eq('11 menit lagi');
	});

	test('compare time correctly', () => {
		const commonService = new CommonService();
        const date = new Date(2000, 1, 1, 10, 10)
        vi.setSystemTime(date)
		const comparator = new Date();
		const comparation = commonService.processComparationTime(
            ['', '09:00'], new Date(), comparator);
		const diff = commonService.generateTimeDiff(
            comparation[1] - comparation[0]);
		expect(diff).not.empty;
		expect(diff).eq('1 Jam 10 menit lagi');
	});
});

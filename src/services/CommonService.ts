export default class CommonService {

    processComparationTime(val: string[], comparation: Date, now: Date = new Date()) {
		const time = val[1] as string;
		const [hours, minute] = time.split(':');
		const hoursInt: number = parseInt(hours);
		const minuteInt: number = parseInt(minute);
		comparation.setHours(hoursInt, minuteInt, 0, 0);
		const miliNow = now.getTime();
		const miliComparation = comparation.getTime();
		return [miliNow, miliComparation];
	}

	generateTimeDiff(diff: number) {
		let labelHours = '';
		let labelMinutes = '';
		let separator = '';
		const timeDifference = Math.abs(diff);
		const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

		labelHours = hoursDifference > 0 ? `${hoursDifference} Jam` : labelHours;
		separator = hoursDifference > 0 ? ' ' : separator;
		labelMinutes = minutesDifference > 0 ? `${minutesDifference} menit lagi` : labelMinutes;

		if (!labelMinutes && labelHours) labelMinutes = 'lagi';

		return `${labelHours}${separator}${labelMinutes}`;
	}
}
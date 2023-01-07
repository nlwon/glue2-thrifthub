import type { TValue } from '$lib/types/availability';
import { set } from 'date-fns';

export default function () {
	const value: TValue = {};
	const today = set(new Date(), {}).toISOString();

	const hours = [];

	for (let h = 8; h < 24; h++) {
		hours.push(`0${h}`.slice(-2));
	}

	const mins = ['00', '15', '30', '45'];
	value[today] = {};
	for (const hour of hours) {
		for (const min of mins) {
			value[today][`${hour}${min}`] = [];
		}
	}

	return value;
}

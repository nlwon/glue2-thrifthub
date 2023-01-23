import { differenceInDays, format, formatDistance } from 'date-fns';

const dynamicAgo = ({ date = new Date(), formatString = 'yyyy-MM-dd hh:mm aaa', maxDays = 7 }) => {
	if (differenceInDays(new Date(), new Date(date)) > maxDays) {
		return format(new Date(date), formatString);
	} else {
		return `${formatDistance(new Date(), new Date(date))} ago`;
	}
};

export default dynamicAgo;

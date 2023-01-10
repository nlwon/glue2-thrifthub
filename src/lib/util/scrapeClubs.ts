import axios from 'axios';
import * as cheerio from 'cheerio';
import Cookies from 'universal-cookie';
import { pb } from '$lib/glue/pocketbase';

const getClubList = async () => {
	const FULL_LIST_URL =
		'https://cornell.campusgroups.com/club_signup?view=all&group_type=15471&category_tags=';
	const SAMPLE_LIST_URL =
		'https://cornell.campusgroups.com/club_signup?group_type=15471&category_tags=';
	const URL = encodeURI(FULL_LIST_URL);
	const { data } = await axios.get(URL);
	const $ = cheerio.load(data);
	const clubs = [];
	const clubItems = $(`.list-group-item`).toArray();

	for (let i = 0; i < clubItems?.length; i++) {
		const el = clubItems[i];

		// console.log(
		// 	$('#info_showed_xxs [aria-label="Mission Statement"]', el)
		// );

		const isRegistered = !$('.badge-warning', el)?.text()?.trim();
		const idArray = $('.noOutlineOnFocus', el)?.attr('id')?.split('_');
		const id = idArray?.length === 2 ? idArray[1] : null;
		const websiteUrl = $('a', el)?.first()?.attr('href')?.trim();
		const name = $('.header-cg--h4', el)?.text()?.trim();
		const desc = $('#info_showed_xxs [aria-label="Mission Statement"]', el)
			?.text()
			?.trim()
			?.split('\n')[1]
			?.trim();

		if (isRegistered && id) {
			const clubRaw = {
				id,
				websiteUrl,
				name,
				desc
			};

			if (websiteUrl?.includes('https://cornell.campusgroups.com/')) {
				try {
					// fetch more data from club website
					const { data } = await axios.get(websiteUrl);
					const $ = cheerio.load(data);
					// console.log($.html());
					const desc = $('p.lead')?.first()?.text()?.trim();
					const officerCount = $('.section-cont__content-quick_facts_officers')?.text()?.trim();
					const memberCount = $('.section-cont__content-quick_facts_members')?.text()?.trim();
					const officers = [];

					$(`.type-team`).each((i, el) => {
						// console.log($('.section-cont__content-officers_position', el).html());
						const name = $('h5', el)?.text()?.trim();
						const position = $('.section-cont__content-officers_position', el)?.text()?.trim();
						officers.push({
							name,
							position
						});
					});
					clubRaw.officerCount = officerCount;
					clubRaw.memberCount = memberCount;
					clubRaw.officers = officers;
				} catch (error) {}
			}

			clubs.push(clubRaw);
		}
	}

	return clubs;
};

const saveClubs = async (clubs) => {
	const failures = [];
	for (let i = 0; i < clubs?.length; i++) {
		const clubRaw = clubs[i];

		try {
			const officersInfo: string = clubRaw?.officers
				? `[Officers]\n${clubRaw?.officers
						?.map((officer) => {
							const position: string = officer?.position ? ` - ${officer?.position}` : '';
							return officer?.name + position;
						})
						?.join('\n')}\n\n`
				: '';

			const club = {
				name: clubRaw?.name,
				subtitle: clubRaw?.officerCount
					? `${clubRaw?.officerCount} officers • ${clubRaw?.memberCount} members`
					: '',
				provider: 'campusgroups',
				providerId: `campusgroups-${clubRaw?.id}`,
				desc: `${officersInfo}[Description]\n${clubRaw?.desc}`,
				category: 'club'
			};

			const savedClub = await pb.collection('topics').create(club);
			console.log('saved', savedClub?.name, Math.floor((i / clubs?.length) * 100), '% complete');
		} catch (error) {
			console.log('failed', error, clubRaw);
			failures?.push(clubRaw);
		}
	}
	console.log('complete. failures:', failures);
	return failures;
};

const scrapeClubs = async () => {
	const clubs = await getClubList();
	saveClubs(clubs);
	// getClubDataByURL();
};

export default scrapeClubs;

/** @type {import('tailwindcss').Config} */

// const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/typography'),
		require('daisyui')
	],
	daisyui: {
		// themes: [
		// {
		// 	light: {
		// 		...require('daisyui/src/colors/themes')['[data-theme=light]'],
		// 		primary: '#53B354'
		// 	}
		// },
		// {
		// 	dark: {
		// 		...require('daisyui/src/colors/themes')['[data-theme=dark]'],
		// 		primary: '#53B354'
		// 	}
		// }
		// ]
	}
};

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
		// 	'light',
		// 	{
		// 		dark: {
		// 			...require('daisyui/src/colors/themes')['[data-theme=dark]'],
		// 			'base-200': colors.slate['700'],
		// 			'base-300': colors.slate['600']
		// 		}
		// 	}
		// ]
	}
};

module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				background: "#121212",
				foreground: {
					DEFAULT: "#FFFFFF",
					secondary: "#9CA3AF",
				},
				border: {
					DEFAULT: "#1F2937",
				},
				btn: {
					background: "#675FFA",
					"background-hover": "#5046E5",
				},
				link: "#60A5FA",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}

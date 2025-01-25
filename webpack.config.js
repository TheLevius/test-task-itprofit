const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

const config = {
	entry: "./src/js/index.js",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		host: "localhost",
		hot: true,
		open: true,
		port: 3000,
		watchFiles: ["src/**/*.html", "./*.html"],
		proxy: [
			{
				context: ["/api"],
				target: "http://localhost:5000",
				secure: false,
				changeOrigin: true,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/index.html",
		}),
		isProduction &&
			new MiniCssExtractPlugin({
				filename: "styles.css",
			}),
	].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: "asset",
			},
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							sourceMap: !isProduction,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: !isProduction,
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
							sourceMap: !isProduction,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: !isProduction,
						},
					},
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass-embedded"),
							sourceMap: !isProduction,
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules|server/,
				use: {
					loader: "swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "ecmascript",
								jsx: false,
								dynamicImport: true,
							},
							target: "es2020",
							loose: false,
							externalHelpers: false,
						},
						module: {
							type: "commonjs",
						},
					},
				},
			},
		],
	},
	ignoreWarnings: [
		{
			module: /sass\.dart\.js/,
			message: /Critical dependency/,
		},
	],
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";
		config.plugins.push(
			new WorkboxWebpackPlugin.GenerateSW({
				clientsClaim: true,
				skipWaiting: true,
			})
		);
	} else {
		config.mode = "development";
	}
	return config;
};

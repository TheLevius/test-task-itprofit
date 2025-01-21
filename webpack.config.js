const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

const config = {
	entry: "./src/index.js",
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
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "index.html",
		}),
		...(isProduction
			? [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })]
			: []),
	],
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
						},
					},
					"postcss-loader",
				],
			},
			{
				test: /\.scss$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "swc-loader",
				},
			},
		],
	},
};
module.exports = () => {
	if (isProduction) {
		config.mode = "production";

		config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
	} else {
		config.mode = "development";
	}
	return config;
};

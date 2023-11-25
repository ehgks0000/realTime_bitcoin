const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.tsx", // 팝업 엔트리 포인트
    background: "./src/background.ts", // 백그라운드 스크립트 엔트리 포인트
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js", // [name]은 각 엔트리 포인트의 이름(popup, background)으로 대체됩니다.
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // 스타일 로더를 CSS 로더와 함께 사용
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup.html",
      filename: path.resolve(__dirname, "public/popup.html"),
      // filename: "popup.html",
      chunks: ["popup"], // popup 엔트리 포인트만 포함
    }),
  ],
};

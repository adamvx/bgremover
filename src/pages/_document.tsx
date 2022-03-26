import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="sk">
				<Head>
					<link rel="shortcut icon" href="/favicon.png" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
					/>
				</Head>
				<body className="antialiased scroll-bar">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

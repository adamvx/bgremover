import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="sk">
				<Head>
					<link rel="shortcut icon" href="/favicon.ico" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
					/>
					<title>BG Remover</title>
					<meta
						name="description"
						content="Created with NEXT.js, MUI and MediaPipe Selfie Segmentation. You can apply multiple background filters to your webcam input just like in Google Meet."
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

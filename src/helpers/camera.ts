import { getVideoStream } from "./getVideoStream";

interface Props {
	onFrame: () => Promise<void>;
	width: number;
	height: number;
}

export class Camera {
	constructor(private video: HTMLVideoElement, private props: Props) {}

	start() {
		getVideoStream(this.props.width, this.props.height)
			.then((stream) => {
				this.video.srcObject = stream;
			})
			.catch((err) => {
				console.log("error loading user media", err);
			});
		this.video.onloadedmetadata = () => {
			this.video.play();
			this.draw();
		};
	}

	async draw() {
		await this.props.onFrame();
		window.requestAnimationFrame(() => this.draw());
	}
}

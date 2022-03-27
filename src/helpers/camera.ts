interface Props {
	onFrame: () => Promise<void>;
	width: number;
	height: number;
}

export class Camera {
	constructor(private video: HTMLVideoElement, private props: Props) {}

	start() {
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: {
					aspectRatio: this.props.width / this.props.height,
				},
			})
			.then((stream) => {
				this.video.srcObject = stream;
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

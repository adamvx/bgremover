import styled from "@emotion/styled";
import { Camera } from "@mediapipe/camera_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import React, { Component } from "react";
import { IFilter } from "../helpers/filters";
import { getResolution } from "../helpers/resolution";
import { Resolution, TResolution } from "../types";

interface Props {
	modelSelection?: "quality" | "performance";
	resolution?: Resolution;
	filter?: IFilter;
}

const HiddenLayer = styled.div`
	display: none;
`;

const Video = styled.video`
	width: 100%;
	border-radius: 4px;
`;

export class Webcam extends Component<Props> {
	private webcamRef = React.createRef<HTMLVideoElement>();
	private contentRef = React.createRef<HTMLVideoElement>();
	private canvasRef = React.createRef<HTMLCanvasElement>();
	private finalResolution: TResolution;
	private camera?: Camera;
	private selfieSegmentation?: SelfieSegmentation;

	constructor(props: Props) {
		super(props);
		this.finalResolution = getResolution(props.resolution || "hd");
	}

	componentDidMount() {
		this.contentRef.current!.srcObject =
			this.canvasRef.current!.captureStream(30);

		this.selfieSegmentation = new SelfieSegmentation({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
			},
		});
		this.selfieSegmentation.setOptions({
			modelSelection: this.props.modelSelection === "performance" ? 1 : 0,
			selfieMode: true,
		});
		this.selfieSegmentation.onResults((res) => {
			const canvasElement = this.canvasRef.current!;
			const context = canvasElement.getContext("2d")!;
			context.save();
			context.clearRect(0, 0, canvasElement.width, canvasElement.height);
			context.drawImage(
				res.image,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);

			if (this.props.filter) {
				context.globalCompositeOperation = "destination-in";
				context.drawImage(
					res.segmentationMask,
					0,
					0,
					canvasElement.width,
					canvasElement.height
				);

				this.props.filter.apply(
					res.image,
					context,
					canvasElement.width,
					canvasElement.height
				);
			}

			context.restore();
		});

		this.camera = new Camera(this.webcamRef.current!, {
			onFrame: async () => {
				await this.selfieSegmentation?.send({ image: this.webcamRef.current! });
			},
			width: this.finalResolution.width,
			height: this.finalResolution.height,
			facingMode: "user",
		});

		this.camera
			?.start()
			.then(() => console.log("Camera started"))
			.catch((err) => console.log("Camera start error", err));
	}

	componentWillUnmount() {
		this.camera
			?.stop()
			.then(() => console.log("Camera stopped"))
			.catch((err) => console.log("Camera stop error", err));
		this.selfieSegmentation
			?.close()
			.then(() => console.log("Segmentation stoped"))
			.catch((err) => console.log("Segmentation stop error", err));
	}

	render() {
		return (
			<>
				<Video autoPlay ref={this.contentRef} />
				<HiddenLayer>
					<video
						autoPlay
						ref={this.webcamRef}
						style={{
							width: this.finalResolution.width,
							height: this.finalResolution.height,
						}}
					/>
					<canvas
						ref={this.canvasRef}
						width={this.finalResolution.width}
						height={this.finalResolution.height}
					/>
				</HiddenLayer>
			</>
		);
	}
}

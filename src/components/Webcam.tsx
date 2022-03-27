import styled from "@emotion/styled";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import React, { Component } from "react";
import { Camera } from "../helpers/camera";
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
	background-color: #222222;
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
		const canvasElement = this.canvasRef.current!;
		const context = canvasElement.getContext("2d")!;
		this.contentRef.current!.srcObject = canvasElement.captureStream(30);

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
		});

		this.camera?.start();
	}

	componentWillUnmount() {
		this.selfieSegmentation
			?.close()
			.then(() => console.log("Segmentation stoped"))
			.catch((err) => console.log("Segmentation stop error", err));
	}

	render() {
		return (
			<div style={{ width: "100%" }}>
				<Video autoPlay ref={this.contentRef} />
				<HiddenLayer>
					<video
						autoPlay
						ref={this.webcamRef}
						style={{
							height: this.finalResolution.height,
							width: this.finalResolution.width,
						}}
					/>
					<canvas
						ref={this.canvasRef}
						width={this.finalResolution.width}
						height={this.finalResolution.height}
					/>
				</HiddenLayer>
			</div>
		);
	}
}

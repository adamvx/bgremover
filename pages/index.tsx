import styled from "@emotion/styled";
import { Camera } from "@mediapipe/camera_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Button, Paper } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useLayoutEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useWindowSize } from "usehooks-ts";

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	padding: 16px;
	display: flex;
	flex-direction: row;
	gap: 16px;
`;

const VideoContainer = styled.div`
	position: relative;
	flex: 1;
	display: flex;
	align-self: center;
	max-height: 100%;
`;

const Canvas = styled.canvas`
	border-radius: 4px;
	transform: rotateY(180deg);
`;

const Home: NextPage = () => {
	const webcamRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const conteninerRef = useRef<HTMLDivElement>(null);

	const size = useWindowSize();

	useEffect(() => {
		if (canvasRef.current && conteninerRef.current) {
			canvasRef.current.width = conteninerRef.current.clientWidth;
			canvasRef.current.height = (conteninerRef.current.clientWidth / 16) * 9;
		}
	}, [size, canvasRef, conteninerRef]);

	useLayoutEffect(() => {
		const selfieSegmentation = new SelfieSegmentation({
			locateFile: (file) => {
				console.log(file);
				return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
			},
		});
		selfieSegmentation.setOptions({ modelSelection: 0, selfieMode: true });
		selfieSegmentation.onResults((res) => {
			const canvasElement = canvasRef.current!;
			const canvasCtx = canvasElement.getContext("2d")!;
			canvasCtx.save();
			canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
			canvasCtx.drawImage(
				res.image,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);

			canvasCtx.globalCompositeOperation = "destination-in";

			canvasCtx.drawImage(
				res.segmentationMask,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);

			canvasCtx.globalCompositeOperation = "destination-atop";
			canvasCtx.fillStyle = "#00FF00";
			canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

			canvasCtx.restore();
		});

		const camera = new Camera(webcamRef.current!, {
			onFrame: async () => {
				await selfieSegmentation.send({ image: webcamRef.current! });
			},
			width: 1920,
			height: 1080,
			facingMode: "user",
		});

		camera.start();

		() => {
			selfieSegmentation.close();
			camera.stop();
		};
	}, []);

	return (
		<Container>
			<VideoContainer ref={conteninerRef}>
				<video
					ref={webcamRef}
					style={{
						display: "none",
						position: "absolute",
						width: "100%",
						height: "100%",
					}}
				/>
				<Canvas ref={canvasRef} />
			</VideoContainer>
			<Paper elevation={1} style={{ width: 384 }}>
				<Button>Hello</Button>
			</Paper>
		</Container>
	);
};

export default Home;

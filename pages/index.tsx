import styled from "@emotion/styled";
import { Camera } from "@mediapipe/camera_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Button, Paper, Switch } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const Container = styled.div`
	width: 100vw;
	max-width: 100%;
	height: 100vh;
	padding: 16px;
	display: flex;
	flex-direction: row;
	gap: 16px;
	position: relative;
`;

const VideoContainer = styled.div`
	flex: 1;
	display: flex;
	align-self: center;
`;

const Video = styled.video`
	width: 100%;
	border-radius: 4px;
`;

const HiddenLayer = styled.div`
	display: none;
`;

const Home: NextPage = () => {
	const webcamRef = useRef<HTMLVideoElement>(null);
	const contentRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [debug, setDebug] = useState(false);

	useEffect(() => {
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

	useLayoutEffect(() => {
		contentRef.current!.srcObject = canvasRef.current!.captureStream(30);
	}, [canvasRef, contentRef]);

	return (
		<>
			<Container>
				<VideoContainer>
					<Video autoPlay ref={contentRef} />
				</VideoContainer>
				<Paper elevation={1} style={{ width: 384 }}>
					<Switch value={debug} onChange={(_, c) => setDebug(c)} />
					{debug ? "DEBUG ON - scroll down" : "DEBUG OFF"}
				</Paper>
			</Container>
			<HiddenLayer style={{ display: debug ? "block" : "none" }}>
				<video
					ref={webcamRef}
					style={{
						width: 1280,
						height: 720,
					}}
				/>
				<canvas ref={canvasRef} width={1280} height={720} />
			</HiddenLayer>
		</>
	);
};

export default Home;

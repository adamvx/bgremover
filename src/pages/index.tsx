import React from "react";
import styled from "@emotion/styled";
import { Button, Paper } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { Webcam } from "../components/Webcam";
import {
	BlurFilter,
	ColorFilter,
	IFilter,
	CustomBackgroundImageFilter,
} from "../helpers/filters";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { DeleteOutlined } from "@mui/icons-material";

const Container = styled.div`
	min-width: 100vw;
	min-height: 100vh;
	padding: 16px;
	display: flex;
	flex-direction: row;
	gap: 16px;
`;

const VideoContainer = styled.div`
	flex: 1;
	display: flex;
	align-self: center;
`;

const StyledButton = styled(Button)`
	padding: 0px 30px;
	height: 70px;
	width: 70px;
	margin: 2px;
`;

const Home: NextPage = () => {
	const [filter, setFilter] = useState<IFilter>();
	const [image, setImage] = useState<File | null>(null);

	const handleFileUpload = (files: FileList | null) => {
		console.log(files?.[0]);
		setImage(files?.[0] || null);
	};
	return (
		<Container>
			<VideoContainer>
				<Webcam filter={filter} />
			</VideoContainer>
			<Paper elevation={1} style={{ width: 384 }}>
				<StyledButton
					style={{ backgroundColor: "#ff0000" }}
					onClick={() => setFilter(new ColorFilter("#ff0000"))}
				></StyledButton>
				<StyledButton
					style={{ backgroundColor: "#00ff00" }}
					onClick={() => setFilter(new ColorFilter("#00ff00"))}
				></StyledButton>
				<StyledButton
					style={{ backgroundColor: "#0000ff" }}
					onClick={() => setFilter(new ColorFilter("#0000ff"))}
				></StyledButton>
				<StyledButton
					style={{ backgroundColor: "#fff000" }}
					onClick={() => setFilter(new ColorFilter("#fff000"))}
				></StyledButton>
				<StyledButton
					style={{
						backgroundColor: "#dfdfdf",
						flexDirection: "column",
						fontSize: "7px",
						color: "#9c9c9c",
					}}
					onClick={() => setFilter(new BlurFilter(6))}
				>
					<BlurOnIcon fontSize="large" /> light blur
				</StyledButton>
				<StyledButton
					style={{
						backgroundColor: "#dfdfdf",
						flexDirection: "column",
						fontSize: "7px",
						color: "#9c9c9c",
					}}
					onClick={() => setFilter(new BlurFilter(12))}
				>
					<BlurOnIcon fontSize="large" /> strong blur
				</StyledButton>
				<input
					type="file"
					accept="image/*"
					onChange={({ target: { files } }) => handleFileUpload(files)}
					style={{ display: "none" }}
				/>
				<StyledButton
					style={{ backgroundColor: "#dfdfdf", color: "#9c9c9c" }}
					onClick={() =>
						image && setFilter(new CustomBackgroundImageFilter(image))
					}
				>
					<FileUploadRoundedIcon fontSize="large" />
				</StyledButton>
				<StyledButton
					style={{ backgroundColor: "#dfdfdf", color: "#9c9c9c" }}
					onClick={() => setFilter(undefined)}
				>
					<DeleteOutlined />
				</StyledButton>

				{/* <Button onClick={() => setFilter(new ColorFilter("#ff0000"))}>
          Red
        </Button>
        <Button onClick={() => setFilter(new ColorFilter("#00ff00"))}>
          Green
        </Button>
        <Button onClick={() => setFilter(new ColorFilter("#0000ff"))}>
          Blue
        </Button>
        <Button onClick={() => setFilter(new ColorFilter("#fff000"))}>
          Yellow
        </Button>
        <Button onClick={() => setFilter(new BlurFilter(6))}>Blur</Button>
        <Button onClick={() => setFilter(new BlurFilter(12))}>Big Blur</Button>
        <Button onClick={() => setFilter(undefined)}>Clear</Button> */}
			</Paper>
		</Container>
	);
};

export default Home;

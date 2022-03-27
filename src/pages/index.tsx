import styled from "@emotion/styled";
import { Button, Paper } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { Webcam } from "../components/Webcam";
import { BlurFilter, ColorFilter, IFilter } from "../helpers/filters";

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

const Home: NextPage = () => {
	const [filter, setFilter] = useState<IFilter>();

	return (
		<Container>
			<VideoContainer>
				<Webcam filter={filter} />
			</VideoContainer>
			<Paper elevation={1} style={{ width: 384 }}>
				<Button onClick={() => setFilter(new ColorFilter("#ff0000"))}>
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
				<Button onClick={() => setFilter(undefined)}>Clear</Button>
			</Paper>
		</Container>
	);
};

export default Home;

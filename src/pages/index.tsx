import styled from "@emotion/styled";
import { BlockOutlined, DeblurOutlined } from "@mui/icons-material";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { Paper } from "@mui/material";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { FilterItem } from "../components/FilterItem";
import { FiltersGroup } from "../components/FiltersGroup";
import { Webcam } from "../components/Webcam";
import {
	BlurFilter,
	ColorFilter,
	CustomBackgroundImageFilter,
	IFilter,
} from "../helpers/filters";
import { getVideoStream } from "../helpers/getVideoStream";
import { getResolution } from "../helpers/resolution";

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
	const [image, setImage] = useState<File | null>(null);
	const [permissionStatus, setPermissionStatus] = useState<boolean>();
	const resolution = getResolution("hd");

	const handleFileUpload = (files: FileList | null) => {
		console.log(files?.[0]);
		setImage(files?.[0] || null);
	};

	useEffect(() => {
		getVideoStream(resolution.width, resolution.height)
			.then(() => setPermissionStatus(true))
			.catch(() => setPermissionStatus(false));
	}, []);

	return (
		<Container>
			<VideoContainer>
				{permissionStatus !== undefined && (
					<Webcam filter={filter} resolution={resolution} />
				)}
			</VideoContainer>
			<Paper elevation={1} style={{ width: 336 }}>
				<FiltersGroup title="Filtre">
					<FilterItem
						tooltip="Odstrániť filtre"
						icon={<BlockOutlined fontSize="large" />}
						onClick={() => setFilter(undefined)}
					/>
					<FilterItem
						tooltip="Ľahké rozmazanie"
						icon={<DeblurOutlined fontSize="large" />}
						onClick={() => setFilter(new BlurFilter(6))}
					/>
					<FilterItem
						tooltip="Silné rozmazanie"
						icon={<BlurOnIcon fontSize="large" />}
						onClick={() => setFilter(new BlurFilter(12))}
					/>
				</FiltersGroup>
				<FiltersGroup title="Farby">
					<FilterItem
						tooltip="Červené pozadie"
						backgroundColor="#ff0000"
						onClick={() => setFilter(new ColorFilter("#ff0000"))}
					/>
					<FilterItem
						tooltip="Zelené pozadie"
						backgroundColor="#00ff00"
						onClick={() => setFilter(new ColorFilter("#00ff00"))}
					/>
					<FilterItem
						tooltip="Modré pozadie"
						backgroundColor="#0000ff"
						onClick={() => setFilter(new ColorFilter("#0000ff"))}
					/>
					<FilterItem
						tooltip="Žlté pozadie"
						backgroundColor="#fff000"
						onClick={() => setFilter(new ColorFilter("#fff000"))}
					/>
					<FilterItem
						tooltip="Biele pozadie"
						backgroundColor="#ffffff"
						onClick={() => setFilter(new ColorFilter("#ffffff"))}
					/>
					<FilterItem
						tooltip="Čierne pozadie"
						backgroundColor="#000000"
						onClick={() => setFilter(new ColorFilter("#000000"))}
					/>
				</FiltersGroup>
				<FiltersGroup title="Vlastné pozadie">
					<input
						type="file"
						accept="image/*"
						onChange={({ target: { files } }) => handleFileUpload(files)}
						style={{ display: "none" }}
					/>
					<FilterItem
						tooltip="Nahrajte si vlasné pozadie"
						icon={<FileUploadRoundedIcon fontSize="large" />}
						onClick={() =>
							image && setFilter(new CustomBackgroundImageFilter(image))
						}
					/>
				</FiltersGroup>
			</Paper>
		</Container>
	);
};

export default Home;

import { Resolution, TResolution } from "../types";

export const getResolution = (res: Resolution): TResolution => {
	switch (res) {
		case "fullHd": {
			return { width: 1920, height: 1080 };
		}
		case "hd": {
			return { width: 1280, height: 720 };
		}
		case "sd": {
			return { width: 720, height: 480 };
		}
	}
};

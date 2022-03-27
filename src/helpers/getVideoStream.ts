export const getVideoStream = async (width: number, height: number) => {
	return await navigator.mediaDevices.getUserMedia({
		video: {
			aspectRatio: width / height,
			width: width,
			height: height,
			facingMode: "user",
		},
	});
};

import { GpuBuffer } from "@mediapipe/selfie_segmentation";

export interface IFilter {
	apply(
		webcam: GpuBuffer,
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	): void;
}

export class ColorFilter implements IFilter {
	constructor(private color: string) {}

	apply(
		_: GpuBuffer,
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	): void {
		context.globalCompositeOperation = "destination-atop";
		context.fillStyle = this.color;
		context.fillRect(0, 0, width, height);
	}
}

export class BlurFilter implements IFilter {
	constructor(private blur: number) {}

	apply(
		webcam: GpuBuffer,
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	): void {
		context.globalCompositeOperation = "destination-atop";
		context.filter = `blur(${this.blur}px)`;
		context.drawImage(webcam, 0, 0, width, height);
	}
}

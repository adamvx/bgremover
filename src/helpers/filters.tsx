import { GpuBuffer } from "@mediapipe/selfie_segmentation";
import { RcFile } from "rc-upload/lib/interface";
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

export class CustomBackgroundImageFilter implements IFilter {
	private img = new Image();

	constructor(private image: RcFile) {
		const fr = new FileReader();
		fr.onload = () => {
			this.img.src = fr.result as string;
		};
		fr.readAsDataURL(this.image);
	}

	apply(
		_: GpuBuffer,
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	): void {
		const scale = Math.max(width / this.img.width, height / this.img.height);
		const x = width / 2 - (this.img.width / 2) * scale;
		const y = height / 2 - (this.img.height / 2) * scale;
		context.globalCompositeOperation = "destination-atop";
		context.drawImage(
			this.img,
			x,
			y,
			this.img.width * scale,
			this.img.height * scale
		);
	}
}

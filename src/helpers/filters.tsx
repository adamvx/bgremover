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
    console.log("1");

    context.drawImage(webcam, 0, 0, width, height);
  }
}

export class CustomBackgroundImage implements IFilter {
  constructor(private image) {}

  apply(
    _: GpuBuffer,
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const img = new Image();
    img.src = URL.createObjectURL(this.image);
    img.height = height;
    img.width = width;
    context.globalCompositeOperation = "destination-atop";
    //context.fillStyle = this.image;
    // context.fillRect(0, 0, width, height);
    console.log(img);
    context.drawImage(img, 0, 0, width, height);
  }
}

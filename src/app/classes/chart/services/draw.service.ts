import { DirectionEnum } from '@core/enums/direction.enum';

export class DrawService {
    public static line(context: CanvasRenderingContext2D, xStart: number, yStart: number, xEnd: number, yEnd: number, thickness: number, color: string): void {
        context.lineWidth = thickness;
        context.strokeStyle = color;

        context.beginPath();
        context.moveTo((xStart), yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
        context.closePath();
    }

    public static rectangleBorder(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, thickness: number, color: string, noBottom: boolean = false): void {
        const halfLineWidth = thickness / 2;

        if (noBottom) y = y + halfLineWidth;
        else y = y - halfLineWidth;

        context.lineWidth = thickness;
        context.strokeStyle = color;
        context.strokeRect(x + halfLineWidth, y, width - thickness, height + thickness);
    }

    public static rectangle(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
        context.fillStyle = color;
        context.lineWidth = 1;
        context.fillRect(x, y, width, height);
    }

    public static text(context: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, align: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'alphabetic'): void {
        context.fillStyle = color;
        context.textAlign = align;
        context.textBaseline = baseline;
        context.fillText(text, x, y);
    }

    public static circle(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
        const radiusX = width / 2;
        const radiusY = height / 2;

        context.fillStyle = color;

        context.beginPath();
        context.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        context.fill();
    }

    public static triangle(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, direction: DirectionEnum): void {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        context.fillStyle = color;

        context.beginPath();

        if (direction === DirectionEnum.up) {
            context.moveTo(x, y);
            context.lineTo(x + halfWidth, y + halfHeight);
            context.lineTo(x - halfWidth, y + halfHeight);
        } else if (direction === DirectionEnum.down) {
            context.moveTo(x, y);
            context.lineTo(x + halfWidth, y - halfHeight);
            context.lineTo(x - halfWidth, y - halfHeight);
        }

        context.closePath();
        context.fill();
    }

    public static triangleBorder(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, thickness: number, color: string, direction: DirectionEnum): void {
        const halfThickness = thickness / 2;
        const halfWidth = width / 2 - thickness;
        const halfHeight = height / 2 - thickness / 2;

        context.lineWidth = thickness;
        context.strokeStyle = color;

        context.beginPath();

        if (direction === DirectionEnum.up) {
            context.moveTo(x, y + halfThickness);
            context.lineTo(x + halfWidth, y + halfHeight);
            context.lineTo(x - halfWidth, y + halfHeight);
        } else if (direction === DirectionEnum.down) {
            context.moveTo(x, y);
            context.lineTo(x + halfWidth, y - halfHeight);
            context.lineTo(x - halfWidth, y - halfHeight);
        }

        context.closePath();
        context.stroke();
    }
}

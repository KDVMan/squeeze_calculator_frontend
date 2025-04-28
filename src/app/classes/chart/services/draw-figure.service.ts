import { DirectionEnum } from '@core/enums/direction.enum';
import { FigureEnum } from '@core/enums/figure.enum';
import { DrawService } from '@app/classes/chart/services/draw.service';

export class DrawFigureService {
    public static draw(context: CanvasRenderingContext2D, figure: FigureEnum, x: number, y: number, width: number, height: number, thickness: number, color: string, direction: DirectionEnum): void {
        if (figure === FigureEnum.triangle) {
            DrawService.triangle(
                context,
                x,
                y,
                width,
                height,
                color,
                direction
            );
        } else if (figure === FigureEnum.corner) {
            // DrawService.corner(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thickness,
            //     color,
            //     direction
            // );
        } else if (figure === FigureEnum.rectangle) {
            DrawService.rectangle(
                context,
                x - width / 2,
                y - height / 2,
                width,
                height,
                color
            );
        } else if (figure === FigureEnum.circle) {
            DrawService.circle(
                context,
                x,
                y,
                width,
                height,
                color
            );
        } else if (figure === FigureEnum.diamond) {
            // DrawService.diamond(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     color
            // );
        } else if (figure === FigureEnum.cross) {
            // DrawService.cross(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thickness,
            //     color
            // );
        }
    }

    public static drawBorder(context: CanvasRenderingContext2D,
                             figure: FigureEnum,
                             x: number,
                             y: number,
                             width: number,
                             height: number,
                             thicknessBody: number,
                             thicknessBorder: number,
                             color: string,
                             direction: DirectionEnum): void {
        if (figure === FigureEnum.triangle) {
            DrawService.triangleBorder(
                context,
                x,
                y,
                width,
                height,
                thicknessBorder,
                color,
                direction
            );
        } else if (figure === FigureEnum.corner) {
            // DrawService.cornerBorder(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thicknessBody,
            //     thicknessBorder,
            //     color,
            //     direction
            // );
        } else if (figure === FigureEnum.rectangle) {
            DrawService.rectangleBorder(
                context,
                x - width / 2,
                y - (height / 2) + thicknessBorder,
                width,
                height - (thicknessBorder * 2),
                thicknessBorder,
                color
            );
        } else if (figure === FigureEnum.circle) {
            // DrawService.circleBorder(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thicknessBorder,
            //     color
            // );
        } else if (figure === FigureEnum.diamond) {
            // DrawService.diamondBorder(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thicknessBorder,
            //     color
            // );
        } else if (figure === FigureEnum.cross) {
            // DrawService.crossBorder(
            //     context,
            //     x,
            //     y,
            //     width,
            //     height,
            //     thicknessBody,
            //     thicknessBorder,
            //     color
            // );
        }
    }
}

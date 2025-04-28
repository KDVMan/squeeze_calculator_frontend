import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
    name: 'minuteDisplay',
    standalone: true
})
export class MinuteDisplayPipe implements PipeTransform {
    constructor(private readonly translationService: TranslationService) {
    }

    transform(value: number): string {
        if (!value || value <= 0) {
            return '';
        }

        if (value < 60) {
            const minuteLabel = this.translationService.getMessage('M003', 'minute');

            return `${value}${minuteLabel}`;
        } else if (value < 1440) {
            const hours = value / 60;
            const hourLabel = this.translationService.getMessage('M003', 'hour');

            return `${Math.round(hours * 100) / 100}${hourLabel}`;
        } else {
            const days = value / 1440;
            const dayLabel = this.translationService.getMessage('M003', 'day');

            return `${parseFloat(days.toFixed(4))}${dayLabel}`;
        }
    }
}

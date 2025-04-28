import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { InitService } from '@app/services/init/init.service';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { InitVariableService } from '@app/services/init/init-variable.service';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

export const appGuard = () => {
    const initService = inject(InitService);
    const initVariableService = inject(InitVariableService);
    const chartSettingsService = inject(ChartSettingsService);
    const symbolListService = inject(SymbolListService);
    const calculatorPresetService = inject(CalculatorPresetService);
    const calculatorFormulaPresetService = inject(CalculatorFormulaPresetService);

    return forkJoin({
        init: initService.load(),
        initVariable: initVariableService.load(),
        chartSettings: chartSettingsService.load(),
        symbolList: symbolListService.load(),
        calculatorPreset: calculatorPresetService.load(),
        calculatorFormulaPreset: calculatorFormulaPresetService.load()
    }).pipe(
        tap(({chartSettings}) => {
            chartSettingsService.init(chartSettings);
        }),
        switchMap(() => of(true)),
        catchError(() => of(false))
    );
};

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, first, Observable, Subject } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { CalculatorFormulaPresetModel } from '@app/models/calculator-formula-preset/calculator-formula-preset.model';
import {
    CalculatorFormulaPresetAddRequestModel,
    CalculatorFormulaPresetDeleteRequestModel,
    CalculatorFormulaPresetDuplicateRequestModel,
    CalculatorFormulaPresetEditRequestModel
} from '@app/models/calculator-formula-preset/calculator-formula-request.model';
import md5 from 'md5';

@Injectable({
	providedIn: 'root'
})
export class CalculatorFormulaPresetService {
	public models: CalculatorFormulaPresetModel[];
	public updateSubject = new BehaviorSubject<CalculatorFormulaPresetModel[]>([]);
	public selectedSubject = new BehaviorSubject<CalculatorFormulaPresetModel | null>(null);
	public setSubject = new Subject<CalculatorFormulaPresetModel>;

	constructor(private readonly httpService: HttpService) {
	}

	public init(models: CalculatorFormulaPresetModel[], event: boolean = true): void {
		this.models = models;
		if (event) this.updateSubject.next(models);
	}

	public load(): Observable<CalculatorFormulaPresetModel[]> {
		return this.httpService.get<CalculatorFormulaPresetModel[]>('calculator_formula_preset/load').pipe(
			first(),
			tap((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || []);
			}),
			catchError((error: HttpErrorResponse) => {
				throw new Error(error.error);
			})
		);
	}

	public add(request: CalculatorFormulaPresetAddRequestModel): void {
		this.httpService
			.post<CalculatorFormulaPresetAddRequestModel, CalculatorFormulaPresetModel[]>('calculator_formula_preset/add', request)
			.pipe(first())
			.subscribe((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || [], true);
			});
	}

	public edit(request: CalculatorFormulaPresetEditRequestModel): void {
		this.httpService
			.post<CalculatorFormulaPresetEditRequestModel, CalculatorFormulaPresetModel[]>('calculator_formula_preset/edit', request)
			.pipe(first())
			.subscribe((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || [], true);
			});
	}

	public delete(request: CalculatorFormulaPresetDeleteRequestModel): void {
		this.httpService
			.post<CalculatorFormulaPresetDeleteRequestModel, CalculatorFormulaPresetModel[]>('calculator_formula_preset/delete', request)
			.pipe(first())
			.subscribe((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || [], true);
			});
	}

	public update(request: CalculatorFormulaPresetModel): void {
		this.setSubject.next(request);

		this.httpService
			.post<CalculatorFormulaPresetModel, CalculatorFormulaPresetModel[]>('calculator_formula_preset/update', request)
			.pipe(first())
			.subscribe((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || [], true);
			});
	}

	public duplicate(request: CalculatorFormulaPresetDuplicateRequestModel): void {
		this.httpService
			.post<CalculatorFormulaPresetDuplicateRequestModel, CalculatorFormulaPresetModel[]>('calculator_formula_preset/duplicate', request)
			.pipe(first())
			.subscribe((response: CalculatorFormulaPresetModel[]) => {
				this.init(response || [], true);
			});
	}

	public getHash(preset: CalculatorFormulaPresetModel): string {
		if (!preset) return '';

		if (!preset.filters) preset.filters = [];
		if (!preset.formulas) preset.formulas = [];

		const filters = preset.filters.map(filter => `${filter.name}:${filter.filter || ''}:${filter.value}`).join('|');
		const formulas = preset.formulas.map(formula => `${formula.name}:${formula.multiplier}`).join('|');

		return md5(`${filters}|${formulas}`);
	}
}

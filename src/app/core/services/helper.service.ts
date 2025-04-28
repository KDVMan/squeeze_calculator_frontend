import { Injectable } from '@angular/core';
import { KeyValueModel } from '@core/models/key-value.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class HelperService {
	private static fieldTypeMap = {
		'minOnScreen': 'number',
		'maxOnScreen': 'number',
		'gapSize': 'number',
		'minWidth': 'number',
		'thickness': 'number',
		'horizontalPadding': 'number',
		'verticalPadding': 'number',
		'horizontalSpacing': 'number',
		'verticalSpacing': 'number',
		'nameSpacing': 'number',
		'fontSize': 'number',
		'wheelSpeedUp': 'number',
		'wheelSpeedDown': 'number',
		'indent': 'number',
		'minLevelPercent': 'number',
		'maxLevelPercent': 'number'
	};

	public static convertArrayToKeyValue(data: string[], translateModule: string = null): KeyValueModel[] {
		const out: KeyValueModel[] = [];

		for (const key of data) {
			out.push({
				key: key,
				value: translateModule ? translateModule + '.' + key : key
			});
		}

		return out;
	}

	public static convertEnumToKeyValue<T>(data: T, translateModule: string = null, exclude: (keyof T)[] = []): KeyValueModel[] {
		const out: KeyValueModel[] = [];

		for (const key of Object.keys(data) as Array<keyof T>) {
			if (!exclude.includes(key)) {
				out.push({
					key: key as string,
					value: translateModule ? `${translateModule}.${data[key]}` : data[key] as string
				});
			}
		}

		return out;
	}

	public static createFormGroupFromModel(formBuilder: FormBuilder, model: any): FormGroup {
		const group = {};

		Object.keys(model).forEach(key => {
			const value = model[key];

			if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
				group[key] = HelperService.createFormGroupFromModel(formBuilder, value);
			} else {
				group[key] = [value];
			}
		});

		return formBuilder.group(group);
	}

	public static createModelFromFormGroup(formGroup: FormGroup): any {
		const model = {};

		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.get(key);

			if (control instanceof FormGroup) {
				model[key] = HelperService.createModelFromFormGroup(control);
			} else {
				const value = control.value;

				switch (HelperService.fieldTypeMap[key]) {
					case 'number':
						model[key] = Number(value);
						break;
					default:
						model[key] = value;
				}
			}
		});

		return model;
	}
}

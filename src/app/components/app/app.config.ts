import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApiInterceptor } from '@core/interceptors/api.interceptor';
import { routes } from '@app/components/app/app.routes';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { provideToastr } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OWL_DATE_TIME_FORMATS, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DictionaryService } from '@core/services/dictionary.service';
import { TranslationService } from '@core/services/translation.service';
import { ConfigService } from '@app/core/services/config.service';

registerLocaleData(localeRu, 'ru');

const dateTimeFormat = {
	fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'},
	datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
	timePickerInput: {hour: 'numeric', minute: 'numeric'},
	monthYearLabel: {year: 'numeric', month: 'short'},
	dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
	monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideAngularSvgIcon(),
		provideHttpClient(withInterceptorsFromDi()),
		provideAnimations(),
		provideToastr({
			positionClass: 'toast-top-right',
			preventDuplicates: false
		}),
		importProvidersFrom(
			TranslateModule.forRoot({
				defaultLanguage: 'ru',
				loader: {
					provide: TranslateLoader,
					useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
					deps: [HttpClient]
				}
			}),
			OwlNativeDateTimeModule
		),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApiInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptor,
			multi: true
		},
		provideAppInitializer(() => inject(ConfigService).load()),
		provideAppInitializer(() => inject(DictionaryService).load()),
		provideAppInitializer(() => inject(TranslationService).load()),
		{
			provide: OWL_DATE_TIME_FORMATS,
			useValue: dateTimeFormat
		},
		{
			provide: LOCALE_ID,
			useValue: 'ru'
		}
	]
};

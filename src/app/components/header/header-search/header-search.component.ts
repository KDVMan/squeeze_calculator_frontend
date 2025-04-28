import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, first, Subscription, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from '@app/core/services/config.service';
import { ClickOutsideDirective } from '@core/directives/click-outside.directive';
import { InputRestrictionDirective } from '@core/directives/input-restriction.directive';
import { UppercaseDirective } from '@core/directives/uppercase.directive';
import { SelectOnFocusDirective } from '@core/directives/select-on-focus.directive';
import { InitService } from '@app/services/init/init.service';
import { SymbolSearchRequestModel } from '@app/models/symbol/symbol-search-request.model';
import { SymbolSearchService } from '@app/services/symbol/symbol-search.service';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';

@Component({
    selector: 'app-header-search',
    templateUrl: './header-search.component.html',
    styleUrl: './header-search.component.scss',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ClickOutsideDirective, InputRestrictionDirective, UppercaseDirective, SelectOnFocusDirective]
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
    private subscriptionInit: Subscription;
    private subscriptionFormGroup: Subscription;
    protected formGroup: FormGroup;
    protected symbols: string[];
    protected focused: boolean = false;
    protected loaded: boolean = false;
    protected regex = /^[A-Za-z0-9]$/;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly configService: ConfigService,
                private readonly initService: InitService,
                private readonly symbolSearchService: SymbolSearchService) {
    }

    public ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            symbol: this.initService.model.symbol
        });

        this.subscriptionInit = this.initService.updateSubject.subscribe((result: InitSubjectModel) => {
            if (this.formGroup.get('symbol').value !== result.model.symbol) this.update(result.model.symbol, false);
        });

        this.subscriptionFormGroup = this.formGroup.valueChanges.pipe(
            debounceTime(this.configService.get('settings.formDebounceTime')),
            distinctUntilChanged(),
            tap(() => this.loaded = false)
        ).subscribe(form => {
            if (form['symbol']) {
                this.onSearch({
                    symbol: form['symbol'].toUpperCase()
                });
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
    }

    public onSearch(request: SymbolSearchRequestModel): void {
        this.symbolSearchService.search(request)
            .pipe(first())
            .subscribe((response: string[]) => {
                if (response.length > 0) {
                    this.symbols = response;
                    this.loaded = true;
                }
            });
    }

    public onSelect(event: MouseEvent): void {
        this.update((<HTMLElement>event.target).innerHTML, true);
    }

    public onClickOutside(): void {
        if (this.focused) {
            this.update(this.initService.model.symbol, false);
        }
    }

    public onSubmit(): void {
        this.update(this.formGroup.get('symbol').value, true);

        if (this.searchInput && this.searchInput.nativeElement) {
            this.searchInput.nativeElement.blur();
        }
    }

    private update(symbol: string, update: boolean): void {
        symbol = symbol.trim().toUpperCase();

        this.focused = false;
        this.loaded = false;
        this.formGroup.get('symbol').setValue(symbol, {emitEvent: false});

        if (update) {
            this.initService.update({
                symbol: symbol
            }, [InitSenderEnum.symbol]);
        }
    }
}

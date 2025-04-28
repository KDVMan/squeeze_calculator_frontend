import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { Subscription } from 'rxjs';
import { ControlContainer, FormGroup } from '@angular/forms';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { SymbolListSenderEnum } from '@app/enums/symbol-list/symbol-list-sender.enum';

@Component({
    selector: 'app-symbol-list-volume',
    templateUrl: './symbol-list-volume.component.html',
    standalone: true,
    imports: [FormInputNumberComponent]
})
export class SymbolListVolumeComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    public formGroup: FormGroup;

    constructor(private readonly controlContainer: ControlContainer,
                private readonly symbolListService: SymbolListService) {
    }

    public ngOnInit(): void {
        this.formGroup = this.controlContainer.control as FormGroup;

        this.subscription = this.formGroup.get('volume').valueChanges.subscribe(volume => {
            this.symbolListService.update({
                volume: Number(volume || 0)
            }, [SymbolListSenderEnum.volume]);
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}

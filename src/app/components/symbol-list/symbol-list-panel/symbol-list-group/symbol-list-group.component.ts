import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { SymbolListSubjectModel } from '@app/models/symbol-list/symbol-list-subject.model';
import { HelperService } from '@core/services/helper.service';
import { InitVariableService } from '@app/services/init/init-variable.service';
import { SymbolListSenderEnum } from '@app/enums/symbol-list/symbol-list-sender.enum';
import { KeyValueModel } from '@core/models/key-value.model';

@Component({
    selector: 'app-symbol-list-group',
    templateUrl: './symbol-list-group.component.html',
    standalone: true,
    imports: [FormSelectComponent]
})
export class SymbolListGroupComponent implements OnInit, OnDestroy {
    @ViewChild(FormSelectComponent) formSelectComponent: FormSelectComponent;
    private subscriptionSymbolList: Subscription;
    private subscriptionForm: Subscription;
    public formGroup: FormGroup;
    public groups: KeyValueModel[];

    constructor(private readonly controlContainer: ControlContainer,
                private readonly initVariableService: InitVariableService,
                private readonly symbolListService: SymbolListService) {
    }

    public ngOnInit(): void {
        this.groups = HelperService.convertArrayToKeyValue(this.initVariableService.model.groups);
        this.formGroup = this.controlContainer.control as FormGroup;

        this.subscriptionSymbolList = this.symbolListService.updateSubject.subscribe(result => this.onUpdate(result));
        this.subscriptionForm = this.formGroup.get('group').valueChanges.subscribe(value => this.onSelect(value));
    }

    public ngOnDestroy(): void {
        if (this.subscriptionSymbolList) this.subscriptionSymbolList.unsubscribe();
        if (this.subscriptionForm) this.subscriptionForm.unsubscribe();
    }

    private onUpdate(result: SymbolListSubjectModel): void {
        if (this.formGroup.get('group').value === result.model.group) return;

        this.formGroup.get('group').setValue(result.model.group, {emitEvent: false});
        this.formSelectComponent.itemActive = this.groups.find(x => x.key === result.model.group);
    }

    private onSelect(value: string): void {
        this.symbolListService.update({
            group: value
        }, [SymbolListSenderEnum.group]);
    }
}

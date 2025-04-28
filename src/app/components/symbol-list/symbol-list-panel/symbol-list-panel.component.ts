import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { SymbolListGroupComponent } from '@app/components/symbol-list/symbol-list-panel/symbol-list-group/symbol-list-group.component';
import { SymbolListVolumeComponent } from '@app/components/symbol-list/symbol-list-panel/symbol-list-volume/symbol-list-volume.component';
import { SymbolListDownloadComponent } from '@app/components/symbol-list/symbol-list-panel/symbol-list-download/symbol-list-download.component';

@Component({
    selector: 'app-symbol-list-panel',
    templateUrl: './symbol-list-panel.component.html',
    styleUrl: './symbol-list-panel.component.scss',
    standalone: true,
    imports: [ReactiveFormsModule, SymbolListGroupComponent, SymbolListVolumeComponent, SymbolListDownloadComponent]
})
export class SymbolListPanelComponent implements OnInit {
    public formGroup: FormGroup;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly symbolListService: SymbolListService) {
    }

    public ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            group: [this.symbolListService.model.group],
            volume: [this.symbolListService.model.volume]
        });
    }
}

import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { LoadingService } from '@core/services/loading.service';
import { LoadingEnum } from '@core/enums/loading.enum';
import { first } from 'rxjs';
import { SymbolDownloadService } from '@app/services/symbol/symbol-download.service';

@Component({
    selector: 'app-symbol-list-download',
    templateUrl: './symbol-list-download.component.html',
    standalone: true,
    imports: [SvgIconComponent]
})
export class SymbolListDownloadComponent {
    constructor(private readonly loadingService: LoadingService,
                private readonly symbolDownloadService: SymbolDownloadService) {
    }

    public onDownload(): void {
        this.loadingService.set(LoadingEnum.symbolDownload, true);

        this.symbolDownloadService.download().pipe(first()).subscribe(_ => {
            this.loadingService.set(LoadingEnum.symbolDownload, false);
        });
    }
}

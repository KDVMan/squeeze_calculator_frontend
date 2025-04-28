import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CalculateService {
    public updateSubject = new Subject<number>();

    public update(index: number): void {
        this.updateSubject.next(index);
    }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    public totalSubject = new Subject<number>;
    public pageSubject = new Subject<number>;

    setTotal(total: number): void {
        this.totalSubject.next(total);
    }

    setPage(page: number): void {
        this.pageSubject.next(page);
    }
}

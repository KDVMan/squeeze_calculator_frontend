import { Routes } from '@angular/router';
import { TerminalComponent } from '@app/components/terminal/terminal.component';
import { appGuard } from '@app/components/app/app.guard';

export const routes: Routes = [
    {path: 'terminal', component: TerminalComponent, canActivate: [appGuard]},
    {path: '**', redirectTo: '/terminal', pathMatch: 'full'}
];

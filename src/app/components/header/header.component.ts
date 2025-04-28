import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderSearchComponent } from '@app/components/header/header-search/header-search.component';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
	standalone: true,
	imports: [
		RouterLink, HeaderSearchComponent
	]
})
export class HeaderComponent {
}

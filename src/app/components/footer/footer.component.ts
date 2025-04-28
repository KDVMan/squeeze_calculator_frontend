import { Component } from '@angular/core';
import { FooterLimitComponent } from '@app/components/footer/footer-limit/footer-limit.component';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
	standalone: true,
	imports: [FooterLimitComponent]
})
export class FooterComponent {
}

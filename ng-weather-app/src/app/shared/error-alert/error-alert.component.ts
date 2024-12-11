import { Component, inject, input } from '@angular/core';
import { ErrorHandlingService } from '../../error-handling.service';

@Component({
  selector: 'app-error-alert',
  imports: [],
  standalone: true,
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.scss',
})
export class ErrorAlertComponent {
  private errorService = inject(ErrorHandlingService);

  alertText = input.required<string>();

  closeAlert() {
    this.errorService.error.next('');
  }
}

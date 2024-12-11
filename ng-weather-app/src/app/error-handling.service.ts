import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  error = new BehaviorSubject<string>('');
}

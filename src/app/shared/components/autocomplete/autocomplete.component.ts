import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-shared-autocomplete',
  standalone: true,
  imports: [AutoCompleteModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAutoCompleteComponent {
  @Input() suggestions: any[] = [];
  @Input() placeholder: string | undefined;
  @Output() completeMethod: EventEmitter<any> = new EventEmitter();
} 
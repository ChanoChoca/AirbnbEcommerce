import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-info-step-control',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './info-step-control.component.html',
  styleUrl: './info-step-control.component.scss'
})
export class InfoStepControlComponent {
  @Input() title: string = '';  // Proporciona un valor por defecto
  @Input() value: number = 0;   // Proporciona un valor por defecto
  @Input() minValue: number = 0; // Valor mínimo por defecto
  @Input() separator: boolean = true; // Añadido: valor por defecto

  @Output() valueChange = new EventEmitter<number>();

  onIncrement() {
    if (this.value < Number.MAX_SAFE_INTEGER) {
      this.valueChange.emit(this.value + 1);
    }
  }

  onDecrement() {
    if (this.value > this.minValue) {
      this.valueChange.emit(this.value - 1);
    }
  }
}

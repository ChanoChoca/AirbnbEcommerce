import {Component, EventEmitter, input, Output} from '@angular/core';
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

  title = input.required<string>();  // Propiedad de entrada obligatoria para el título
  value = input.required<number>();  // Propiedad de entrada obligatoria para el valor
  minValue = input<number>(0);  // Propiedad de entrada opcional para el valor mínimo, inicializada en 0

  @Output()
  valueChange = new EventEmitter<number>();  // Evento emitido cuando el valor cambia

  separator = input<boolean>(true);  // Propiedad de entrada opcional para el separador, inicializada en true

  onIncrement() {
    this.valueChange.emit(this.value() + 1);  // Incrementa el valor y emite el nuevo valor
  }

  onDecrement() {
    this.valueChange.emit(this.value() - 1);  // Decrementa el valor y emite el nuevo valor
  }

}

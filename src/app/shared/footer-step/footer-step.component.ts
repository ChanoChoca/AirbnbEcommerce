import { Component, EventEmitter, input, Output } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Step } from "../../landlord/properties-create/step.model";

@Component({
  selector: 'app-footer-step', // Selector para el componente
  standalone: true, // Indica que este componente es independiente
  imports: [
    FontAwesomeModule // Importa FontAwesomeModule para íconos
  ],
  templateUrl: './footer-step.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./footer-step.component.scss'] // Ruta al archivo de estilos SCSS
})
export class FooterStepComponent {

  // Propiedades de entrada del componente, se definen con el decorador `input`
  currentStep = input.required<Step>(); // Paso actual, requerido
  loading = input<boolean>(false); // Estado de carga, valor por defecto `false`
  isAllStepsValid = input<boolean>(false); // Validez de todos los pasos, valor por defecto `false`
  labelFinishedBtn = input<string>("Finish"); // Etiqueta del botón de finalizar, valor por defecto "Finish"

  // Emisores de eventos para comunicar con otros componentes
  @Output()
  finish = new EventEmitter<boolean>(); // Evento emitido al finalizar

  @Output()
  previous = new EventEmitter<boolean>(); // Evento emitido al retroceder

  @Output()
  next = new EventEmitter<boolean>(); // Evento emitido al avanzar

  // Métodos para emitir los eventos correspondientes
  onFinish() {
    this.finish.emit(true); // Emite el evento `finish` con valor `true`
  }

  onPrevious() {
    this.previous.emit(true); // Emite el evento `previous` con valor `true`
  }

  onNext() {
    this.next.emit(true); // Emite el evento `next` con valor `true`
  }
}

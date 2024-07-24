import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Step} from "../../project/properties-create/step.model";

@Component({
  selector: 'app-footer-step',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './footer-step.component.html',
  styleUrl: './footer-step.component.scss'
})
export class FooterStepComponent {

  @Input() currentStep!: Step; // Define como @Input() y usa el operador non-null assertion
  @Input() loading: boolean = false; // Define como @Input() con valor por defecto
  @Input() isAllStepsValid: boolean = false; // Define como @Input() con valor por defecto
  @Input() labelFinishedBtn: string = 'Finish'; // Define como @Input() con valor por defecto

  @Output() finish = new EventEmitter<void>(); // Cambia el tipo de emisión a void
  @Output() previous = new EventEmitter<void>(); // Cambia el tipo de emisión a void
  @Output() next = new EventEmitter<void>(); // Cambia el tipo de emisión a void

  onFinish() {
    this.finish.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    this.next.emit();
  }
}

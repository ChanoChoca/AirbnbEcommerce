import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, NgForm} from "@angular/forms";
import {Description} from "../../../model/listing.model";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [InputTextModule, FormsModule, InputTextModule, InputTextareaModule],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss'
})
export class DescriptionStepComponent {

  description = input.required<Description>();  // Propiedad de entrada para la descripción del listado

  @Output()
  descriptionChange = new EventEmitter<Description>();  // Evento para emitir cambios en la descripción

  @Output()
  stepValidityChange = new EventEmitter<boolean>();  // Evento para emitir la validez del paso actual

  @ViewChild("formDescription")
  formDescription: NgForm | undefined;  // Referencia al formulario de descripción

  onTitleChange(newTitle: string) {
    this.description().title = {value: newTitle};  // Actualiza el título en la descripción
    this.descriptionChange.emit(this.description());  // Emite el nuevo valor de la descripción
    this.stepValidityChange.emit(this.validateForm());  // Emite la validez del formulario
  }

  onDescriptionChange(newDescription: string) {
    this.description().description = {value: newDescription};  // Actualiza la descripción en el objeto de descripción
    this.descriptionChange.emit(this.description());  // Emite el nuevo valor de la descripción
    this.stepValidityChange.emit(this.validateForm());  // Emite la validez del formulario
  }

  private validateForm(): boolean {
    if (this.formDescription) {
      return this.formDescription?.valid!;  // Retorna si el formulario es válido
    } else {
      return false;  // Retorna falso si el formulario no está disponible
    }
  }
}

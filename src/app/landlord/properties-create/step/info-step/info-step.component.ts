import {Component, EventEmitter, input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {InfoStepControlComponent} from "./info-step-control/info-step-control.component";
import {NewListingInfo} from "../../../model/listing.model";

export type Control = "GUESTS" | "BEDROOMS" | "BEDS" | "BATHS"

@Component({
  selector: 'app-info-step',
  standalone: true,
  imports: [FormsModule, ButtonModule, FontAwesomeModule, InfoStepControlComponent],
  templateUrl: './info-step.component.html',
  styleUrl: './info-step.component.scss'
})
export class InfoStepComponent {

  infos = input.required<NewListingInfo>();  // Propiedad de entrada para la información del listado

  @Output()
  infoChange = new EventEmitter<NewListingInfo>();  // Evento para emitir cambios en la información del listado

  @Output()
  stepValidityChange = new EventEmitter<boolean>();  // Evento para emitir la validez del paso actual

  onInfoChange(newValue: number, valueType: Control) {
    switch (valueType) {
      case "BATHS":
        this.infos().baths = {value: newValue};  // Actualiza el número de baños
        break;
      case "BEDROOMS":
        this.infos().bedrooms = {value: newValue};  // Actualiza el número de dormitorios
        break;
      case "BEDS":
        this.infos().beds = {value: newValue};  // Actualiza el número de camas
        break;
      case "GUESTS":
        this.infos().guests = {value: newValue};  // Actualiza el número de huéspedes
        break;
    }

    this.infoChange.emit(this.infos());  // Emite el nuevo valor de la información del listado
    this.stepValidityChange.emit(this.validationRules());  // Emite la validez del paso actual
  }

  validationRules(): boolean {
    return this.infos().guests.value >= 1;  // Verifica que el número de huéspedes sea al menos 1
  }

}

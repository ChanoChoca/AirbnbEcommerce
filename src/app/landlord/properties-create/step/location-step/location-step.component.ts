import {Component, EventEmitter, input, Output} from '@angular/core';
import {LocationMapComponent} from "./location-map/location-map.component";

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [
    LocationMapComponent
  ],
  templateUrl: './location-step.component.html',
  styleUrl: './location-step.component.scss'
})
export class LocationStepComponent {

  location = input.required<string>();  // Propiedad de entrada obligatoria para la ubicación

  @Output()
  locationChange = new EventEmitter<string>();  // Evento emitido cuando la ubicación cambia

  @Output()
  stepValidityChange = new EventEmitter<boolean>();  // Evento emitido cuando cambia la validez del paso

  onLocationChange(location: string) {
    this.locationChange.emit(location);  // Emite el nuevo valor de la ubicación
    this.stepValidityChange.emit(true);  // Emite un valor indicando que el paso es válido
  }
}

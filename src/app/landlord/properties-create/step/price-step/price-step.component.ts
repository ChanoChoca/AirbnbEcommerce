import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PriceVO} from "../../../model/listing-vo.model";

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [FormsModule, InputTextModule, FontAwesomeModule],
  templateUrl: './price-step.component.html',
  styleUrls: ['./price-step.component.scss'] // Corrección del nombre de la propiedad de `styleUrl` a `styleUrls`
})
export class PriceStepComponent {

  // Entrada de datos
  price = input.required<PriceVO>(); // Objeto que contiene la información del precio

  @Output()
  priceChange = new EventEmitter<PriceVO>(); // Emite los cambios en el precio

  @Output()
  stepValidityChange = new EventEmitter<boolean>(); // Emite la validez del paso

  @ViewChild("formPrice")
  formPrice: NgForm | undefined; // Referencia al formulario del precio

  // Maneja el cambio en el precio y emite los eventos correspondientes
  onPriceChange(newPrice: number) {
    this.priceChange.emit({value: newPrice}); // Emite el nuevo valor del precio
    this.stepValidityChange.emit(this.validateForm()); // Emite la validez del paso basado en la validación del formulario
  }

  // Valida el formulario de precios
  private validateForm() {
    if (this.formPrice) {
      return this.formPrice?.valid!; // Retorna `true` si el formulario es válido, `false` de lo contrario
    } else {
      return false; // Retorna `false` si el formulario no está disponible
    }
  }
}

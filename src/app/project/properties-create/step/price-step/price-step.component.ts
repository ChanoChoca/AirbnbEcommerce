import {Component, EventEmitter, Input, input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PriceVO} from "../../../model/listing-vo.model";

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [FormsModule, InputTextModule, FontAwesomeModule],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent {

  @Input() price: PriceVO = { value: 0 }; // Define como @Input() con valor por defecto

  @Output() priceChange = new EventEmitter<PriceVO>();
  @Output() stepValidityChange = new EventEmitter<boolean>();

  @ViewChild('formPrice') formPrice: NgForm | undefined;

  onPriceChange(newPrice: number) {
    this.price = { value: newPrice }; // Actualiza la propiedad directamente
    this.priceChange.emit(this.price);
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm(): boolean {
    return this.formPrice?.valid ?? false;
  }
}

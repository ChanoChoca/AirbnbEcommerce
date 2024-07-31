import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { BookedDatesDTOFromServer } from "../../model/booking.model";
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-search-date',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule
  ],
  templateUrl: './search-date.component.html',
  styleUrl: './search-date.component.scss'
})
export class SearchDateComponent {

  // Fechas de búsqueda recibidas como entrada (input) del componente
  dates = input.required<BookedDatesDTOFromServer>();

  // Arreglo para almacenar las fechas seleccionadas por el usuario
  searchDateRaw = new Array<Date>();

  // Fecha mínima permitida para la selección en el calendario
  minDate = new Date();

  // Emisor de eventos para cambios en las fechas seleccionadas
  @Output()
  datesChange = new EventEmitter<BookedDatesDTOFromServer>();

  // Emisor de eventos para indicar la validez del paso actual
  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  // Método llamado cuando cambian las fechas seleccionadas
  onDateChange(newBookingDate: Date[]) {
    this.searchDateRaw = newBookingDate;
    const isDateValid = this.validateDateSearch();
    this.stepValidityChange.emit(isDateValid);

    if (isDateValid) {
      // Crea un objeto BookedDatesDTOFromServer con las fechas seleccionadas
      const searchDate: BookedDatesDTOFromServer = {
        startDate: this.searchDateRaw[0],
        endDate: this.searchDateRaw[1]
      }
      // Emite el objeto con las fechas seleccionadas
      this.datesChange.emit(searchDate);
    }
  }

  // Método para validar las fechas seleccionadas
  private validateDateSearch() {
    return this.searchDateRaw.length === 2
      && this.searchDateRaw[0] !== null
      && this.searchDateRaw[1] !== null
      && this.searchDateRaw[0].getDate() !== this.searchDateRaw[1].getDate()
  }

  constructor() {
    // Restaura las fechas previamente seleccionadas cuando se inicializa el componente
    this.restorePreviousDate();
  }

  // Método para restaurar las fechas previas al inicializar el componente
  private restorePreviousDate() {
    effect(() => {
      if (this.dates()) {
        this.searchDateRaw[0] = this.dates().startDate;
        this.searchDateRaw[1] = this.dates().endDate;
      }
    });
  }
}

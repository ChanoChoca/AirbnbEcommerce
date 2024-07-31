import { Component, inject } from '@angular/core';
import { Step } from "../../landlord/properties-create/step.model";
import { Search } from "./search.model";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Router } from "@angular/router";
import { BookedDatesDTOFromServer } from "../model/booking.model";
import { NewListingInfo } from "../../landlord/model/listing.model";
import dayjs from "dayjs";
import { LocationMapComponent } from "../../landlord/properties-create/step/location-step/location-map/location-map.component";
import { FooterStepComponent } from "../../shared/footer-step/footer-step.component";
import { SearchDateComponent } from "./search-date/search-date.component";
import { InfoStepComponent } from "../../landlord/properties-create/step/info-step/info-step.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    LocationMapComponent,
    FooterStepComponent,
    SearchDateComponent,
    InfoStepComponent
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  // Identificadores para los pasos del formulario
  LOCATION = "location";
  DATES = "dates";
  GUESTS = "guests";

  // Definición de los pasos del formulario
  steps: Step[] = [
    {
      id: this.LOCATION,
      idNext: this.DATES,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.DATES,
      idNext: this.GUESTS,
      idPrevious: this.LOCATION,
      isValid: false
    },
    {
      id: this.GUESTS,
      idNext: null,
      idPrevious: this.DATES,
      isValid: false
    }
  ];

  // Paso actual del formulario
  currentStep = this.steps[0];

  // Datos de búsqueda iniciales
  newSearch: Search = {
    dates: {
      startDate: new Date(),
      endDate: new Date(),
    },
    infos: {
      guests: { value: 0 },
      bedrooms: { value: 0 },
      beds: { value: 0 },
      baths: { value: 0 }
    },
    location: ""
  };

  // Indicador de carga durante la búsqueda
  loadingSearch = false;

  // Servicios inyectados
  dialogDynamicRef = inject(DynamicDialogRef);
  router = inject(Router);

  // Avanza al siguiente paso del formulario
  nextStep() {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.find(step => step.id === this.currentStep.idNext)!;
    }
  }

  // Retrocede al paso anterior del formulario
  previousStep() {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.find(step => step.id === this.currentStep.idPrevious)!;
    }
  }

  // Verifica si todos los pasos del formulario son válidos
  isAllStepsValid() {
    return this.steps.every(step => step.isValid);
  }

  // Actualiza la validez del paso actual
  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  // Actualiza la ubicación en la búsqueda
  onNewLocation(newLocation: string): void {
    this.currentStep.isValid = true;
    this.newSearch.location = newLocation;
  }

  // Actualiza las fechas en la búsqueda
  onNewDate(newDates: BookedDatesDTOFromServer) {
    this.newSearch.dates = newDates;
  }

  // Actualiza la información adicional en la búsqueda
  onInfoChange(newInfo: NewListingInfo) {
    this.newSearch.infos = newInfo;
  }

  // Realiza la búsqueda y navega a la página de resultados
  search() {
    this.loadingSearch = false;
    this.router.navigate(["/"], {
      queryParams: {
        location: this.newSearch.location,
        guests: this.newSearch.infos.guests.value,
        bedrooms: this.newSearch.infos.bedrooms.value,
        beds: this.newSearch.infos.beds.value,
        baths: this.newSearch.infos.baths.value,
        startDate: dayjs(this.newSearch.dates.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(this.newSearch.dates.endDate).format("YYYY-MM-DD"),
      }
    });
    this.dialogDynamicRef.close();
  }
}

import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { CardListing } from "../../landlord/model/listing.model"; // Importa el modelo CardListing
import { BookedListing } from "../../tenant/model/booking.model"; // Importa el modelo BookedListing
import { Router } from "@angular/router"; // Importa el servicio Router para la navegación
import { CategoryService } from "../../layout/navbar/category/category.service"; // Importa el servicio CategoryService
import { CountryService } from "../../landlord/properties-create/step/location-step/country.service"; // Importa el servicio CountryService
import { CurrencyPipe, DatePipe } from "@angular/common"; // Importa pipes para formato de fecha y moneda
import { FaIconComponent } from "@fortawesome/angular-fontawesome"; // Importa el componente FaIcon para íconos

@Component({
  selector: 'app-card-listing', // Selector para el componente
  standalone: true, // Indica que el componente es independiente
  imports: [
    DatePipe, // Pipe para formatear fechas
    CurrencyPipe, // Pipe para formatear monedas
    FaIconComponent // Componente para íconos de FontAwesome
  ],
  templateUrl: './card-listing.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./card-listing.component.scss'] // Ruta al archivo de estilos SCSS
})
export class CardListingComponent {

  // Propiedades de entrada del componente, se definen con el decorador `input`
  listing = input.required<CardListing | BookedListing>(); // Listado que puede ser un CardListing o un BookedListing, requerido
  cardMode = input<"landlord" | "booking">(); // Modo de la tarjeta, puede ser "landlord" o "booking"

  // Emisores de eventos para comunicar con otros componentes
  @Output()
  deleteListing = new EventEmitter<CardListing>(); // Evento emitido al eliminar un listado

  @Output()
  cancelBooking = new EventEmitter<BookedListing>(); // Evento emitido al cancelar una reserva

  // Propiedades internas para almacenar datos de listado
  bookingListing: BookedListing | undefined; // Listado reservado, opcional
  cardListing: CardListing | undefined; // Listado de tarjeta, opcional

  // Servicios inyectados para acceder a funcionalidades externas
  router = inject(Router); // Servicio para la navegación
  categoryService = inject(CategoryService); // Servicio para categorías
  countryService = inject(CountryService); // Servicio para países

  constructor() {
    this.listenToListing(); // Llama al método para escuchar cambios en el listado
    this.listenToCardMode(); // Llama al método para escuchar cambios en el modo de tarjeta
  }

  // Método para escuchar cambios en el listado y actualizar la ubicación
  private listenToListing() {
    effect(() => {
      const listing = this.listing(); // Obtiene el listado actual
      this.countryService.getCountryByCode(listing.location) // Llama al servicio para obtener el país por código
        .subscribe({
          next: country => {
            if (listing) {
              this.listing().location = country.region + ", " + country.name.common; // Actualiza la ubicación con nombre común y región
            }
          }
        });
    });
  }

  // Método para escuchar cambios en el modo de tarjeta y asignar el listado correspondiente
  private listenToCardMode() {
    effect(() => {
      const cardMode = this.cardMode(); // Obtiene el modo de tarjeta actual
      if (cardMode && cardMode === "booking") {
        this.bookingListing = this.listing() as BookedListing; // Asigna a bookingListing si el modo es "booking"
      } else {
        this.cardListing = this.listing() as CardListing; // Asigna a cardListing si el modo no es "booking"
      }
    });
  }

  // Métodos para emitir eventos correspondientes
  onDeleteListing(displayCardListingDTO: CardListing) {
    this.deleteListing.emit(displayCardListingDTO); // Emite el evento de eliminación con el listado proporcionado
  }

  onCancelBooking(bookedListing: BookedListing) {
    this.cancelBooking.emit(bookedListing); // Emite el evento de cancelación con el listado reservado proporcionado
  }

  // Método para manejar clics en la tarjeta y navegar a la vista del listado
  onClickCard(publicId: string) {
    this.router.navigate(['listing'], { queryParams: { id: publicId } }); // Navega a la ruta 'listing' con el parámetro id
  }
}

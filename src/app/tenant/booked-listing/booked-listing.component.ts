import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from "../service/booking.service"; // Importa el servicio para manejar reservas
import { ToastService } from "../../layout/toast.service"; // Importa el servicio de notificaciones
import { BookedListing } from "../model/booking.model"; // Importa el modelo para reservas
import { CardListingComponent } from "../../shared/card-listing/card-listing.component"; // Importa el componente para mostrar listados
import { FaIconComponent } from "@fortawesome/angular-fontawesome"; // Importa el componente para íconos FontAwesome

@Component({
  selector: 'app-booked-listing', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [
    CardListingComponent, // Componente para mostrar listados
    FaIconComponent // Componente para íconos
  ],
  templateUrl: './booked-listing.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./booked-listing.component.scss'] // Ruta al archivo de estilos SCSS
})
export class BookedListingComponent implements OnInit, OnDestroy {

  // Servicios inyectados para acceso a funcionalidades externas
  bookingService = inject(BookingService); // Servicio para manejar reservas
  toastService = inject(ToastService); // Servicio para mostrar notificaciones

  // Propiedades internas del componente
  bookedListings = new Array<BookedListing>(); // Arreglo de reservas
  loading = false; // Estado de carga

  constructor() {
    this.listenFetchBooking(); // Configura la reacción a los cambios en la obtención de reservas
    this.listenCancelBooking(); // Configura la reacción a los cambios en la cancelación de reservas
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel(); // Limpia el estado de cancelación de reservas al destruir el componente
  }

  ngOnInit(): void {
    this.fetchBooking(); // Obtiene las reservas al inicializar el componente
  }

  private fetchBooking() {
    this.loading = true; // Establece el estado de carga
    this.bookingService.getBookedListing(); // Llama al servicio para obtener las reservas
  }

  onCancelBooking(bookedListing: BookedListing) {
    bookedListing.loading = true; // Establece el estado de carga para la reserva a cancelar
    this.bookingService.cancel(bookedListing.bookingPublicId, bookedListing.listingPublicId, false); // Cancela la reserva
  }

  private listenFetchBooking() {
    effect(() => {
      const bookedListingsState = this.bookingService.getBookedListingSig(); // Obtiene el estado de las reservas
      if (bookedListingsState.status === "OK") {
        this.loading = false; // Desactiva el estado de carga
        this.bookedListings = bookedListingsState.value!; // Actualiza el arreglo de reservas
      } else if (bookedListingsState.status === "ERROR") {
        this.loading = false; // Desactiva el estado de carga
        this.toastService.send({
          severity: "error", summary: "Error when fetching the listing", // Muestra un mensaje de error si falla la obtención de reservas
        });
      }
    });
  }

  private listenCancelBooking() {
    effect(() => {
      const cancelState = this.bookingService.cancelSig(); // Obtiene el estado de la cancelación
      if (cancelState.status === "OK") {
        // Encuentra el índice de la reserva que se ha cancelado
        const listingToDeleteIndex = this.bookedListings.findIndex(
          listing => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings.splice(listingToDeleteIndex, 1); // Elimina la reserva del arreglo
        this.toastService.send({
          severity: "success", summary: "Successfully cancelled booking", // Muestra un mensaje de éxito si la reserva se cancela correctamente
        });
      } else if (cancelState.status === "ERROR") {
        // Encuentra el índice de la reserva que ha fallado en la cancelación
        const listingToDeleteIndex = this.bookedListings.findIndex(
          listing => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings[listingToDeleteIndex].loading = false; // Desactiva el estado de carga para la reserva
        this.toastService.send({
          severity: "error", summary: "Error when cancel your booking", // Muestra un mensaje de error si falla la cancelación de la reserva
        });
      }
    });
  }
}

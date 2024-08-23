import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Listing } from "../../landlord/model/listing.model"; // Importa el modelo Listing
import { BookingService } from "../service/booking.service"; // Importa el servicio de reservas
import { ToastService } from "../../layout/toast.service"; // Importa el servicio de notificaciones
import { AuthService } from "../../core/auth/auth.service"; // Importa el servicio de autenticación
import { Router } from "@angular/router"; // Importa el servicio Router para la navegación
import dayjs from "dayjs"; // Importa la biblioteca dayjs para manejar fechas
import { BookedDatesDTOFromClient, CreateBooking } from "../model/booking.model"; // Importa modelos relacionados con reservas
import { CurrencyPipe } from "@angular/common"; // Importa el pipe para formateo de moneda
import { CalendarModule } from "primeng/calendar"; // Importa el módulo de calendario de PrimeNG
import { FormsModule } from "@angular/forms"; // Importa el módulo de formularios de Angular
import { MessageModule } from "primeng/message"; // Importa el módulo de mensajes de PrimeNG

@Component({
  selector: 'app-book-date', // Selector para el componente
  standalone: true, // Indica que el componente es independiente
  imports: [
    CurrencyPipe, // Pipe para formatear valores monetarios
    CalendarModule, // Módulo para calendario de PrimeNG
    FormsModule, // Módulo para formularios en Angular
    MessageModule // Módulo para mostrar mensajes de PrimeNG
  ],
  templateUrl: './book-date.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./book-date.component.scss'] // Ruta al archivo de estilos SCSS
})
export class BookDateComponent implements OnInit, OnDestroy {

  // Propiedades de entrada del componente, se definen con el decorador `input`
  listing = input.required<Listing>(); // Listado de propiedades requerido
  listingPublicId = input.required<string>(); // ID público del listado requerido

  // Servicios inyectados para acceder a funcionalidades externas
  bookingService = inject(BookingService); // Servicio para manejar reservas
  toastService = inject(ToastService); // Servicio para mostrar notificaciones
  authService = inject(AuthService); // Servicio para manejar autenticación
  router = inject(Router); // Servicio para navegación

  // Propiedades internas del componente
  bookingDates = new Array<Date>(); // Arreglo de fechas seleccionadas para la reserva
  totalPrice = 0; // Precio total calculado

  minDate = new Date(); // Fecha mínima para la selección del calendario
  bookedDates = new Array<Date>(); // Arreglo de fechas ya reservadas

  constructor() {
    this.listenToCheckAvailableDate(); // Llama al método para escuchar disponibilidad de fechas
    this.listenToCreateBooking(); // Llama al método para escuchar creación de reservas
  }

  ngOnDestroy(): void {
    this.bookingService.resetCreateBooking(); // Limpia el estado de creación de reservas al destruir el componente
  }

  ngOnInit(): void {
    this.bookingService.checkAvailability(this.listingPublicId()); // Verifica la disponibilidad de fechas al inicializar
  }

  onDateChange(newBookingDates: Array<Date>) {
    this.bookingDates = newBookingDates; // Actualiza las fechas de reserva
    if (this.validateMakeBooking()) {
      const startBookingDateDayJS = dayjs(newBookingDates[0]); // Convierte la fecha de inicio a dayjs
      const endBookingDateDayJS = dayjs(newBookingDates[1]); // Convierte la fecha de fin a dayjs
      this.totalPrice = endBookingDateDayJS.diff(startBookingDateDayJS, "days") * this.listing().price.value; // Calcula el precio total
    } else {
      this.totalPrice = 0; // Reinicia el precio total si la reserva no es válida
    }
  }

  validateMakeBooking() {
    // Valida si la reserva es posible según las fechas seleccionadas y autenticación
    return this.bookingDates.length === 2
      && this.bookingDates[0] !== null
      && this.bookingDates[1] !== null
      && this.bookingDates[0].getDate() !== this.bookingDates[1].getDate()
      && this.authService.isAuthenticated();
  }

  onNewBooking() {
    const newBooking: CreateBooking = {
      listingPublicId: this.listingPublicId(), // ID del listado
      startDate: this.bookingDates[0], // Fecha de inicio
      endDate: this.bookingDates[1], // Fecha de fin
    }
    this.bookingService.create(newBooking); // Llama al servicio para crear una nueva reserva
  }

  private listenToCheckAvailableDate() {
    effect(() => {
      const checkAvailabilityState = this.bookingService.checkAvailabilitySig(); // Obtiene el estado de disponibilidad
      if (checkAvailabilityState.status === "OK") {
        this.bookedDates = this.mapBookedDatesToDate(checkAvailabilityState.value!); // Mapea fechas reservadas
      } else if (checkAvailabilityState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the not available dates", summary: "Error",
        }); // Muestra un mensaje de error si falla la verificación de disponibilidad
      }
    });
  }

  private mapBookedDatesToDate(bookedDatesDTOFromClients: Array<BookedDatesDTOFromClient>): Array<Date> {
    const bookedDates = new Array<Date>(); // Arreglo para fechas reservadas
    for (let bookedDate of bookedDatesDTOFromClients) {
      bookedDates.push(...this.getDatesInRange(bookedDate)); // Añade fechas en el rango de cada reserva
    }
    return bookedDates;
  }

  private getDatesInRange(bookedDate: BookedDatesDTOFromClient) {
    const dates = new Array<Date>(); // Arreglo para fechas en rango
    let currentDate = bookedDate.startDate; // Fecha de inicio de la reserva
    while (currentDate <= bookedDate.endDate) { // Itera hasta la fecha de fin
      dates.push(currentDate.toDate()); // Añade la fecha actual al arreglo
      currentDate = currentDate.add(1, "day"); // Avanza al siguiente día
    }
    return dates;
  }

  private listenToCreateBooking() {
    effect(() => {
      const createBookingState = this.bookingService.createBookingSig(); // Obtiene el estado de creación de reserva
      if (createBookingState.status === "OK") {
        this.toastService.send({
          severity: "success", detail: "Booking created successfully",
        }); // Muestra un mensaje de éxito si la reserva se crea correctamente
        this.router.navigate(['/booking']); // Navega a la página de reservas
      } else if (createBookingState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Booking created failed",
        }); // Muestra un mensaje de error si falla la creación de la reserva
      }
    });
  }
}

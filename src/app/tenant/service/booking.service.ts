import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { State } from "../../core/model/state.model";
import { BookedDatesDTOFromClient, BookedDatesDTOFromServer, BookedListing, CreateBooking } from "../model/booking.model";
import { environment } from "../../../environments/environment";
import { map } from "rxjs";
import dayjs from "dayjs";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  // Inyecta HttpClient para hacer solicitudes HTTP
  private http = inject(HttpClient);

  // Signal para manejar el estado de la creación de una nueva reserva
  private createBooking$: WritableSignal<State<boolean>>
    = signal(State.Builder<boolean>().forInit());
  createBookingSig = computed(() => this.createBooking$());

  // Signal para manejar el estado de la verificación de disponibilidad
  private checkAvailability$: WritableSignal<State<Array<BookedDatesDTOFromClient>>>
    = signal(State.Builder<Array<BookedDatesDTOFromClient>>().forInit());
  checkAvailabilitySig = computed(() => this.checkAvailability$());

  // Signal para manejar el estado de la obtención de reservas
  private getBookedListing$: WritableSignal<State<Array<BookedListing>>>
    = signal(State.Builder<Array<BookedListing>>().forInit());
  getBookedListingSig = computed(() => this.getBookedListing$());

  // Signal para manejar el estado de la cancelación de una reserva
  private cancel$: WritableSignal<State<string>>
    = signal(State.Builder<string>().forInit());
  cancelSig = computed(() => this.cancel$());

  // Signal para manejar el estado de la obtención de reservas para el arrendador
  private getBookedListingForLandlord$: WritableSignal<State<Array<BookedListing>>>
    = signal(State.Builder<Array<BookedListing>>().forInit());
  getBookedListingForLandlordSig = computed(() => this.getBookedListingForLandlord$());

  // Método para crear una nueva reserva
  create(newBooking: CreateBooking) {
    this.http.post<boolean>(`${environment.API_URL}/booking/create`, newBooking)
      .subscribe({
        next: created => this.createBooking$.set(State.Builder<boolean>().forSuccess(created)),
        error: err => this.createBooking$.set(State.Builder<boolean>().forError(err)),
      });
  }

  // Método para verificar la disponibilidad de fechas para un listado
  checkAvailability(publicId: string): void {
    const params = new HttpParams().set("listingPublicId", publicId);
    this.http.get<Array<BookedDatesDTOFromServer>>(`${environment.API_URL}/booking/check-availability`, { params })
      .pipe(
        map(this.mapDateToDayJS())
      ).subscribe({
      next: bookedDates =>
        this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forSuccess(bookedDates)),
      error: err => this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forError(err))
    })
  }

  constructor() {
  }

  // Método para mapear fechas de formato Date a DayJS
  private mapDateToDayJS = () => {
    return (bookedDates: Array<BookedDatesDTOFromServer>): Array<BookedDatesDTOFromClient> => {
      return bookedDates.map(reservedDate => this.convertDateToDayJS(reservedDate))
    }
  }

  // Método para convertir un objeto BookedDatesDTOFromServer a BookedDatesDTOFromClient usando DayJS
  private convertDateToDayJS<T extends BookedDatesDTOFromServer>(dto: T): BookedDatesDTOFromClient {
    return {
      ...dto,
      startDate: dayjs(dto.startDate),
      endDate: dayjs(dto.endDate),
    };
  }

  // Método para restablecer el estado de la creación de reservas
  resetCreateBooking() {
    this.createBooking$.set(State.Builder<boolean>().forInit());
  }

  // Método para obtener la lista de reservas
  getBookedListing(): void {
    this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get-booked-listing`)
      .subscribe({
        next: bookedListings =>
          this.getBookedListing$.set(State.Builder<Array<BookedListing>>().forSuccess(bookedListings)),
        error: err => this.getBookedListing$.set(State.Builder<Array<BookedListing>>().forError(err)),
      });
  }

  // Método para cancelar una reserva
  cancel(bookingPublicId: string, listingPublicId: string, byLandlord: boolean): void {
    const params = new HttpParams()
      .set("bookingPublicId", bookingPublicId)
      .set("listingPublicId", listingPublicId)
      .set("byLandlord", byLandlord);
    this.http.delete<string>(`${environment.API_URL}/booking/cancel`, { params })
      .subscribe({
        next: canceledPublicId => this.cancel$.set(State.Builder<string>().forSuccess(canceledPublicId)),
        error: err => this.cancel$.set(State.Builder<string>().forError(err)),
      });
  }

  // Método para restablecer el estado de la cancelación de reservas
  resetCancel(): void {
    this.cancel$.set(State.Builder<string>().forInit());
  }

  // Método para obtener la lista de reservas para el arrendador
  getBookedListingForLandlord(): void {
    this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get-booked-listing-for-landlord`)
      .subscribe({
        next: bookedListings =>
          this.getBookedListingForLandlord$.set(State.Builder<Array<BookedListing>>().forSuccess(bookedListings)),
        error: err => this.getBookedListingForLandlord$.set(State.Builder<Array<BookedListing>>().forError(err)),
      });
  }

}

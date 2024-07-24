import {Component, effect, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {BookedDatesDTOFromClient, CreateBooking} from "../model/booking.model";
import dayjs from "dayjs";
import {Router} from "@angular/router";
import {AuthService} from "../../core/auth/auth.service";
import {ToastService} from "../../layout/toast.service";
import {BookingService} from "../service/booking.service";
import {Listing} from "../../project/model/listing.model";
import {MessageModule} from "primeng/message";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {CurrencyPipe} from "@angular/common"; // Importa Input desde @angular/core

@Component({
  selector: 'app-book-date',
  standalone: true,
  imports: [
    CurrencyPipe,
    CalendarModule,
    FormsModule,
    MessageModule
  ],
  templateUrl: './book-date.component.html',
  styleUrls: ['./book-date.component.scss'] // Cambia styleUrl a styleUrls
})
export class BookDateComponent implements OnInit, OnDestroy {

  @Input() listing!: Listing; // Utiliza @Input() para las propiedades
  @Input() listingPublicId!: string;

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  bookingDates = new Array<Date>();
  totalPrice = 0;

  minDate = new Date();
  bookedDates = new Array<Date>();

  constructor() {
    this.listenToCheckAvailableDate();
    this.listenToCreateBooking();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCreateBooking();
  }

  ngOnInit(): void {
    if (this.listingPublicId) {
      this.bookingService.checkAvailability(this.listingPublicId);
    }
  }

  onDateChange(newBookingDates: Array<Date>) {
    this.bookingDates = newBookingDates;
    if (this.validateMakeBooking()) {
      const startBookingDateDayJS = dayjs(newBookingDates[0]);
      const endBookingDateDayJS = dayjs(newBookingDates[1]);
      this.totalPrice = endBookingDateDayJS.diff(startBookingDateDayJS, "days") * this.listing.price.value;
    } else {
      this.totalPrice = 0;
    }
  }

  validateMakeBooking() {
    return this.bookingDates.length === 2
      && this.bookingDates[0] !== null
      && this.bookingDates[1] !== null
      && this.bookingDates[0].getDate() !== this.bookingDates[1].getDate()
      && this.authService.isAuthenticated();
  }

  onNewBooking() {
    const newBooking: CreateBooking = {
      listingPublicId: this.listingPublicId,
      startDate: this.bookingDates[0],
      endDate: this.bookingDates[1],
    }
    this.bookingService.create(newBooking);
  }

  private listenToCheckAvailableDate() {
    effect(() => {
      const checkAvailabilityState = this.bookingService.checkAvailabilitySig();
      if (checkAvailabilityState.status === "OK") {
        this.bookedDates = this.mapBookedDatesToDate(checkAvailabilityState.value!);
      } else if (checkAvailabilityState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the not available dates", summary: "Error",
        });
      }
    });
  }

  private mapBookedDatesToDate(bookedDatesDTOFromClients: Array<BookedDatesDTOFromClient>): Array<Date> {
    const bookedDates = new Array<Date>();
    for (let bookedDate of bookedDatesDTOFromClients) {
      bookedDates.push(...this.getDatesInRange(bookedDate));
    }
    return bookedDates;
  }

  private getDatesInRange(bookedDate: BookedDatesDTOFromClient) {
    const dates = new Array<Date>();

    let currentDate = bookedDate.startDate;
    while (currentDate <= bookedDate.endDate) {
      dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }

  private listenToCreateBooking() {
    effect(() => {
      const createBookingState = this.bookingService.createBookingSig();
      if (createBookingState.status === "OK") {
        this.toastService.send({
          severity: "success", detail: "Booking created successfully",
        });
        this.router.navigate(['/booking']);
      } else if (createBookingState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Booking created failed",
        });
      }
    });
  }
}

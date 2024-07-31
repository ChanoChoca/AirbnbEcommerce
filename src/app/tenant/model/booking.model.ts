import { DisplayPicture } from "../../landlord/model/listing.model";
import { PriceVO } from "../../landlord/model/listing-vo.model";
import { Dayjs } from "dayjs";

// Interfaz para las fechas reservadas recibidas del servidor
export interface BookedDatesDTOFromServer {
  startDate: Date;
  endDate: Date;
}

// Interfaz para la información de un listado reservado
export interface BookedListing {
  location: string; // Ubicación del listado
  cover: DisplayPicture; // Imagen de portada del listado
  totalPrice: PriceVO; // Precio total de la reserva
  dates: BookedDatesDTOFromServer; // Fechas reservadas
  bookingPublicId: string; // ID público de la reserva
  listingPublicId: string; // ID público del listado
  loading: boolean; // Estado de carga
}

// Interfaz para crear una nueva reserva
export interface CreateBooking {
  startDate: Date; // Fecha de inicio de la reserva
  endDate: Date; // Fecha de fin de la reserva
  listingPublicId: string; // ID público del listado para la reserva
}

// Interfaz para las fechas reservadas recibidas del cliente
export interface BookedDatesDTOFromClient {
  startDate: Dayjs; // Fecha de inicio de la reserva en formato Dayjs
  endDate: Dayjs; // Fecha de fin de la reserva en formato Dayjs
}

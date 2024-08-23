import { BookedDatesDTOFromServer } from "../model/booking.model";
import { NewListingInfo } from "../../landlord/model/listing.model";

// Interfaz que define los datos necesarios para realizar una búsqueda
export interface Search {
  // Ubicación para la búsqueda
  location: string,

  // Fechas de búsqueda, incluyendo fecha de inicio y fin
  dates: BookedDatesDTOFromServer,

  // Información adicional sobre el listado, como número de invitados, habitaciones, etc.
  infos: NewListingInfo
}

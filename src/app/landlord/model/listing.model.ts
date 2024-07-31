import {BathsVO, BedroomsVO, BedsVO, DescriptionVO, GuestsVO, PriceVO, TitleVO} from "./listing-vo.model"; // Importaciones de VO (Value Objects)
import {CategoryName} from "../../layout/navbar/category/category.model"; // Importación del modelo de categoría
import {NewListingPicture} from "./picture.model"; // Importación del modelo de imagen

// Interfaz para la información de un nuevo listado
export interface NewListingInfo {
  guests: GuestsVO, // Número de huéspedes
  bedrooms: BedroomsVO, // Número de habitaciones
  beds: BedsVO, // Número de camas
  baths: BathsVO // Número de baños
}

// Interfaz para un nuevo listado
export interface NewListing {
  category: CategoryName, // Nombre de la categoría
  location: string, // Ubicación del listado
  infos: NewListingInfo, // Información del listado
  pictures: Array<NewListingPicture>, // Array de imágenes del nuevo listado
  description: Description, // Descripción del listado
  price: PriceVO // Precio del listado
}

// Interfaz para la descripción de un listado
export interface Description {
  title: TitleVO, // Título del listado
  description: DescriptionVO // Descripción del listado
}

// Interfaz para un listado creado
export interface CreatedListing {
  publicId: string // ID público del listado creado
}

// Interfaz para una imagen de display
export interface DisplayPicture {
  file?: string, // Archivo de la imagen
  fileContentType?: string, // Tipo de contenido del archivo
  isCover?: boolean // Indica si es la imagen de portada
}

// Interfaz para un listado en formato de tarjeta
export interface CardListing {
  price: PriceVO, // Precio del listado
  location: string, // Ubicación del listado
  cover: DisplayPicture, // Imagen de portada
  bookingCategory: CategoryName, // Categoría de reserva
  publicId: string, // ID público del listado
  loading: boolean // Estado de carga
}

// Interfaz para un listado completo
export interface Listing {
  description: Description, // Descripción del listado
  pictures: Array<DisplayPicture>, // Array de imágenes del listado
  infos: NewListingInfo, // Información del listado
  price: PriceVO, // Precio del listado
  category: CategoryName, // Categoría del listado
  location: string, // Ubicación del listado
  landlord: LandlordListing // Información del arrendador
}

// Interfaz para la información del arrendador
export interface LandlordListing {
  firstname: string, // Nombre del arrendador
  imageUrl: string, // URL de la imagen del arrendador
}

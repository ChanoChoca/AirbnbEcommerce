import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { TenantListingService } from "../tenant-listing.service"; // Servicio para obtener los listados de inquilinos
import { ActivatedRoute } from "@angular/router"; // Servicio para acceder a los parámetros de la ruta
import { ToastService } from "../../layout/toast.service"; // Servicio para mostrar notificaciones
import { CategoryService } from "../../layout/navbar/category/category.service"; // Servicio para obtener categorías
import { CountryService } from "../../landlord/properties-create/step/location-step/country.service"; // Servicio para obtener países
import { DisplayPicture, Listing } from "../../landlord/model/listing.model"; // Modelos para los listados
import { Category } from "../../layout/navbar/category/category.model"; // Modelo para categorías
import { map } from "rxjs"; // Operador para transformar observables
import { NgClass } from "@angular/common"; // Directiva para aplicar clases CSS condicionales
import { FaIconComponent } from "@fortawesome/angular-fontawesome"; // Componente para íconos FontAwesome
import { AvatarComponent } from "../../layout/navbar/avatar/avatar.component"; // Componente para avatares
import { BookDateComponent } from "../book-date/book-date.component"; // Componente para reserva de fechas

@Component({
  selector: 'app-display-listing', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [
    NgClass, // Directiva para clases condicionales
    FaIconComponent, // Componente para íconos
    AvatarComponent, // Componente para avatares
    BookDateComponent // Componente para la reserva de fechas
  ],
  templateUrl: './display-listing.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./display-listing.component.scss'] // Ruta al archivo de estilos SCSS
})
export class DisplayListingComponent implements OnInit, OnDestroy {

  // Servicios inyectados
  tenantListingService = inject(TenantListingService); // Servicio para obtener listados
  activatedRoute = inject(ActivatedRoute); // Servicio para acceder a los parámetros de la ruta
  toastService = inject(ToastService); // Servicio para mostrar notificaciones
  categoryService = inject(CategoryService); // Servicio para obtener categorías
  countryService = inject(CountryService); // Servicio para obtener países

  listing: Listing | undefined; // Listado actual
  category: Category | undefined; // Categoría del listado
  currentPublicId = ""; // ID público del listado actual

  loading = true; // Estado de carga

  constructor() {
    this.listenToFetchListing(); // Configura la reacción a los cambios en la obtención del listado
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetOneByPublicId(); // Limpia el estado de obtención del listado al destruir el componente
  }

  ngOnInit(): void {
    this.extractIdParamFromRouter(); // Extrae el ID del listado desde los parámetros de la ruta al inicializar el componente
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(params => params['id']) // Extrae el ID del listado desde los parámetros de la ruta
    ).subscribe({
      next: publicId => this.fetchListing(publicId) // Llama al método para obtener el listado con el ID extraído
    });
  }

  private fetchListing(publicId: string) {
    this.loading = true; // Establece el estado de carga
    this.currentPublicId = publicId; // Establece el ID público actual
    this.tenantListingService.getOneByPublicId(publicId); // Llama al servicio para obtener el listado por ID público
  }

  private listenToFetchListing() {
    effect(() => {
      const listingByPublicIdState = this.tenantListingService.getOneByPublicIdSig(); // Obtiene el estado de la solicitud de listado
      if (listingByPublicIdState.status === "OK") {
        this.loading = false; // Desactiva el estado de carga
        this.listing = listingByPublicIdState.value; // Asigna el listado obtenido
        if (this.listing) {
          this.listing.pictures = this.putCoverPictureFirst(this.listing.pictures); // Ordena las imágenes para que la de portada sea la primera
          this.category = this.categoryService.getCategoryByTechnicalName(this.listing.category); // Obtiene la categoría del listado
          this.countryService.getCountryByCode(this.listing.location) // Obtiene el país por código
            .subscribe({
              next: country => {
                if (this.listing) {
                  this.listing.location = country.region + ", " + country.name.common; // Actualiza la ubicación con el nombre del país
                }
              }
            });
        }
      } else if (listingByPublicIdState.status === "ERROR") {
        this.loading = false; // Desactiva el estado de carga
        this.toastService.send({
          severity: "error", detail: "Error when fetching the listing", // Muestra un mensaje de error si la solicitud falla
        });
      }
    });
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    const coverIndex = pictures.findIndex(picture => picture.isCover); // Encuentra el índice de la imagen de portada
    if (coverIndex >= 0) { // Verifica si se encontró una imagen de portada
      const cover = pictures[coverIndex]; // Obtiene la imagen de portada
      pictures.splice(coverIndex, 1); // Elimina la imagen de portada del arreglo
      pictures.unshift(cover); // Inserta la imagen de portada al principio del arreglo
    }
    return pictures; // Retorna el arreglo con la imagen de portada al principio
  }
}

import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {LandlordListingService} from "../landlord-listing.service";
import {ToastService} from "../../layout/toast.service";
import {CardListing} from "../model/listing.model";
import {CardListingComponent} from "../../shared/card-listing/card-listing.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit, OnDestroy {

  // Inyección de servicios necesarios para el componente
  landlordListingService = inject(LandlordListingService);
  toastService = inject(ToastService);

  listings: Array<CardListing> | undefined = []; // Lista de propiedades a mostrar
  loadingDeletion = false; // Estado de carga para la eliminación de listados
  loadingFetchAll = false; // Estado de carga para la obtención de todos los listados

  constructor() {
    this.listenFetchAll(); // Configura la escucha para obtener todos los listados
    this.listenDeleteByPublicId(); // Configura la escucha para la eliminación de listados por ID
  }

  // Configura la escucha para la obtención de todos los listados
  private listenFetchAll() {
    effect(() => {
      const allListingState = this.landlordListingService.getAllSig();
      if (allListingState.status === "OK" && allListingState.value) {
        this.loadingFetchAll = false;
        this.listings = allListingState.value; // Actualiza la lista de listados si la obtención fue exitosa
      } else if (allListingState.status === "ERROR") {
        // Muestra un mensaje de error si ocurre un problema al obtener los listados
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when fetching the listing",
        });
      }
    });
  }

  // Configura la escucha para la eliminación de listados por ID
  private listenDeleteByPublicId() {
    effect(() => {
      const deleteState = this.landlordListingService.deleteSig();
      if (deleteState.status === "OK" && deleteState.value) {
        // Elimina el listado de la lista si la eliminación fue exitosa
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings?.splice(listingToDeleteIndex!, 1);
        this.toastService.send({
          severity: "success", summary: "Deleted successfully", detail: "Listing deleted successfully.",
        });
      } else if (deleteState.status === "ERROR") {
        // Maneja el error si la eliminación falla
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings![listingToDeleteIndex!].loading = false;
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when deleting the listing",
        });
      }
      this.loadingDeletion = false; // Finaliza el estado de carga de eliminación
    });
  }

  // Método del ciclo de vida de Angular llamado al destruir el componente
  ngOnDestroy(): void {
    // Aquí podrías realizar tareas de limpieza si es necesario
  }

  // Método del ciclo de vida de Angular llamado al inicializar el componente
  ngOnInit(): void {
    this.fetchListings(); // Obtiene la lista de propiedades cuando el componente se inicializa
  }

  // Método para eliminar un listado
  onDeleteListing(listing: CardListing): void {
    listing.loading = true; // Marca el listado como cargando durante la eliminación
    this.landlordListingService.delete(listing.publicId); // Llama al servicio para eliminar el listado
  }

  // Método para obtener todos los listados
  private fetchListings() {
    this.loadingFetchAll = true; // Marca el estado de carga de obtención de todos los listados
    this.landlordListingService.getAll(); // Llama al servicio para obtener todos los listados
  }
}

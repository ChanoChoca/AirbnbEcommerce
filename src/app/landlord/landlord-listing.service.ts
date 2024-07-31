import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CardListing, CreatedListing, NewListing} from "./model/listing.model"; // Modelos de listado
import {State} from "../core/model/state.model"; // Modelo de estado
import {environment} from "../../environments/environment"; // Configuración de entorno

@Injectable({
  providedIn: 'root' // Proveedor de servicio en el nivel raíz
})
export class LandlordListingService {

  http = inject(HttpClient); // Inyección del servicio HttpClient

  constructor() { }

  // Estado para la creación de listados
  private create$: WritableSignal<State<CreatedListing>> = signal(State.Builder<CreatedListing>().forInit())
  createSig = computed(() => this.create$());

  // Estado para obtener todos los listados
  private getAll$: WritableSignal<State<Array<CardListing>>> = signal(State.Builder<Array<CardListing>>().forInit())
  getAllSig = computed(() => this.getAll$());

  // Estado para la eliminación de listados
  private delete$: WritableSignal<State<string>> = signal(State.Builder<string>().forInit())
  deleteSig = computed(() => this.delete$());

  // Método para crear un nuevo listado
  create(newListing: NewListing): void {
    const formData = new FormData();
    // Agregar imágenes al formData
    for(let i = 0; i < newListing.pictures.length; ++i) {
      formData.append("picture-" + i, newListing.pictures[i].file);
    }
    // Clonar el objeto de nuevo listado y limpiar las imágenes
    const clone = structuredClone(newListing);
    clone.pictures = [];
    formData.append("dto", JSON.stringify(clone));
    // Enviar solicitud POST para crear el listado
    this.http.post<CreatedListing>(`${environment.API_URL}/landlord-listing/create`, formData).subscribe({
      next: listing => this.create$.set(State.Builder<CreatedListing>().forSuccess(listing)), // Actualizar estado en caso de éxito
      error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)), // Actualizar estado en caso de error
    });
  }

  // Método para reiniciar el estado de la creación de listados
  resetListingCreation(): void {
    this.create$.set(State.Builder<CreatedListing>().forInit())
  }

  // Método para obtener todos los listados
  getAll(): void {
    this.http.get<Array<CardListing>>(`${environment.API_URL}/landlord-listing/get-all`)
      .subscribe({
        next: listings => this.getAll$.set(State.Builder<Array<CardListing>>().forSuccess(listings)), // Actualizar estado en caso de éxito
        error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)), // Actualizar estado en caso de error
      });
  }

  // Método para eliminar un listado por su id público
  delete(publicId: string): void {
    const params = new HttpParams().set("publicId", publicId); // Crear parámetros de solicitud
    this.http.delete<string>(`${environment.API_URL}/landlord-listing/delete`, {params})
      .subscribe({
        next: publicId => this.delete$.set(State.Builder<string>().forSuccess(publicId)), // Actualizar estado en caso de éxito
        error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)), // Actualizar estado en caso de error
      });
  }

  // Método para reiniciar el estado de la eliminación de listados
  resetDelete() {
    this.delete$.set(State.Builder<string>().forInit());
  }
}

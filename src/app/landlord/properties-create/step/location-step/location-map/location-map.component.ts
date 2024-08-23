import {Component, effect, EventEmitter, inject, input, Output} from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {FormsModule} from "@angular/forms";
import {AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent} from "primeng/autocomplete";
import {CountryService} from "../country.service";
import {ToastService} from "../../../../../layout/toast.service";
import {OpenStreetMapProvider} from "leaflet-geosearch";
import {Country} from "../country.model";
import L, {circle, latLng, polygon, tileLayer} from "leaflet";
import {filter} from "rxjs";

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    LeafletModule,
    FormsModule,
    AutoCompleteModule
  ],
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']  // Corrige el nombre de la propiedad de `styleUrl` a `styleUrls`
})
export class LocationMapComponent {

  // Inyección de servicios
  countryService = inject(CountryService);
  toastService = inject(ToastService);

  private map: L.Map | undefined;
  private provider: OpenStreetMapProvider | undefined;

  // Entrada de datos
  location = input.required<string>();
  placeholder = input<string>("Select your home country");

  // Información de la ubicación actual
  currentLocation: Country | undefined;

  @Output()
  locationChange = new EventEmitter<string>();

  // Formateo de la etiqueta para mostrar en el autocompletado
  formatLabel = (country: Country) => country.flag + "   " + country.name.common;

  // Configuración inicial del mapa
  options = {
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 18, attribution: "..."}),
    ],
    zoom: 5,
    center: latLng(-34.5883809, -61.0319544)
  }

  // Controles de capas del mapa
  layersControl = {
    baseLayers: {
      "Open Street Map": tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "..."
      }),
    },
    overlays: {
      "Big Circle": circle([-34.5883809, -61.0319544], { radius: 5000 }),
      "Big Square": polygon([
        [-34.5883809 + 0.1, -61.0319544 - 0.1],
        [-34.5883809 + 0.1, -61.0319544 + 0.1],
        [-34.5883809 - 0.1, -61.0319544 + 0.1],
        [-34.5883809 - 0.1, -61.0319544 - 0.1]
      ])
    }
  }

  // Datos de países
  countries: Array<Country> = [];
  filteredCountries: Array<Country> = [];

  constructor() {
    this.listenToLocation(); // Inicializa la escucha de cambios en la ubicación
  }

  // Callback para cuando el mapa esté listo
  onMapReady(map: L.Map) {
    this.map = map;
    this.configSearchControl(); // Configura el control de búsqueda
  }

  // Configuración del proveedor de búsqueda
  private configSearchControl() {
    this.provider = new OpenStreetMapProvider();
  }

  // Maneja el cambio de ubicación en el autocompletado
  onLocationChange(newEvent: AutoCompleteSelectEvent) {
    const newCountry = newEvent.value as Country;
    this.locationChange.emit(newCountry.cca3); // Emite el código del país
  }

  // Escucha los cambios en la ubicación
  private listenToLocation() {
    effect(() => {
      const countriesState = this.countryService.countries();
      if (countriesState.status === "OK" && countriesState.value) {
        this.countries = countriesState.value;
        this.filteredCountries = countriesState.value;
        this.changeMapLocation(this.location()); // Actualiza la ubicación del mapa
      } else if (countriesState.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error",
          detail: "Something went wrong when loading countries on change location"
        });
      }
    });
  }

  // Cambia la ubicación en el mapa
  private changeMapLocation(term: string) {
    this.currentLocation = this.countries.find(country => country.cca3 === term);
    if (this.currentLocation) {
      this.provider!.search({query: this.currentLocation.name.common})
        .then((results) => {
          if (results && results.length > 0) {
            const firstResult = results[0];
            this.map!.setView(new L.LatLng(firstResult.y, firstResult.x), 13);
            L.marker([firstResult.y, firstResult.x])
              .addTo(this.map!)
              .bindPopup(firstResult.label)
              .openPopup();
          }
        })
    }
  }

  // Filtra los países para el autocompletado
  search(newCompleteEvent: AutoCompleteCompleteEvent): void {
    this.filteredCountries =
      this.countries.filter(country => country.name.common.toLowerCase().startsWith(newCompleteEvent.query))
  }

  // Método protegido que solo filtra la información (se puede usar para pruebas u otros fines)
  protected readonly filter = filter;
}

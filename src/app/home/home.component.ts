import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TenantListingService} from "../tenant/tenant-listing.service"; // Servicio de listados de inquilinos
import {ToastService} from "../layout/toast.service"; // Servicio de notificaciones
import {CategoryService} from "../layout/navbar/category/category.service"; // Servicio de categorías
import {ActivatedRoute, Router} from "@angular/router"; // Servicios de rutas y navegación
import {CardListing} from "../landlord/model/listing.model"; // Modelo de listado de tarjetas
import {Pagination} from "../core/model/request.model"; // Modelo de paginación
import {filter, Subscription} from "rxjs"; // Operadores y clases de RxJS
import {Category} from "../layout/navbar/category/category.model"; // Modelo de categoría
import {FaIconComponent} from "@fortawesome/angular-fontawesome"; // Componente de ícono FontAwesome
import {CardListingComponent} from "../shared/card-listing/card-listing.component"; // Componente de listado de tarjetas
import {Search} from "../tenant/search/search.model"; // Modelo de búsqueda
import dayjs from "dayjs"; // Biblioteca de manipulación de fechas

@Component({
  selector: 'app-home', // Selector del componente
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  templateUrl: './home.component.html', // Ruta de la plantilla HTML
  styleUrl: './home.component.scss' // Ruta del archivo de estilos
})
export class HomeComponent implements OnInit, OnDestroy {

  tenantListingService = inject(TenantListingService); // Inyección del servicio de listados de inquilinos
  toastService = inject(ToastService); // Inyección del servicio de notificaciones
  categoryService = inject(CategoryService); // Inyección del servicio de categorías
  activatedRoute = inject(ActivatedRoute); // Inyección del servicio de rutas activadas
  router = inject(Router); // Inyección del servicio de navegación

  listings: Array<CardListing> | undefined; // Lista de listados de tarjetas

  pageRequest: Pagination = {size: 20, page: 0, sort: []}; // Configuración de paginación

  loading = false; // Indicador de carga

  categoryServiceSubscription: Subscription | undefined; // Suscripción al servicio de categorías
  searchIsLoading = false; // Indicador de búsqueda en curso
  emptySearch = false; // Indicador de búsqueda vacía
  private searchSubscription: Subscription | undefined; // Suscripción a la búsqueda

  constructor() {
    this.listenToGetAllCategory(); // Inicializar escucha de categorías
    this.listenToSearch(); // Inicializar escucha de búsqueda
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetAllCategory(); // Reiniciar categorías

    if (this.categoryServiceSubscription) {
      this.categoryServiceSubscription.unsubscribe(); // Desuscribir del servicio de categorías
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe(); // Desuscribir de la búsqueda
    }
  }

  ngOnInit(): void {
    this.startNewSearch(); // Iniciar nueva búsqueda
    this.listenToChangeCategory(); // Escuchar cambios de categoría
  }

  private listenToChangeCategory() {
    this.categoryServiceSubscription = this.categoryService.changeCategoryObs.subscribe({
      next: (category: Category) => {
        this.loading = true; // Mostrar indicador de carga
        if (!this.searchIsLoading) {
          this.tenantListingService.getAllByCategory(this.pageRequest, category.technicalName); // Obtener listados por categoría
        }
      }
    })
  }

  private listenToGetAllCategory() {
    effect(() => {
      const categoryListingsState = this.tenantListingService.getAllByCategorySig();
      if (categoryListingsState.status === "OK") {
        this.listings = categoryListingsState.value?.content; // Actualizar listados
        this.loading = false; // Ocultar indicador de carga
        this.emptySearch = false; // Ocultar indicador de búsqueda vacía
      } else if (categoryListingsState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the listing", summary: "Error",
        }); // Mostrar notificación de error
        this.loading = false; // Ocultar indicador de carga
        this.emptySearch = false; // Ocultar indicador de búsqueda vacía
      }
    });
  }

  private listenToSearch() {
    this.searchSubscription = this.tenantListingService.search.subscribe({
      next: searchState => {
        if (searchState.status === "OK") {
          this.loading = false; // Ocultar indicador de carga
          this.searchIsLoading = false; // Ocultar indicador de búsqueda en curso
          this.listings = searchState.value?.content; // Actualizar listados
          this.emptySearch = this.listings?.length === 0; // Actualizar indicador de búsqueda vacía
        } else if (searchState.status === "ERROR") {
          this.loading = false; // Ocultar indicador de carga
          this.searchIsLoading = false; // Ocultar indicador de búsqueda en curso
          this.toastService.send({
            severity: "error", summary: "Error when search listing",
          }); // Mostrar notificación de error
        }
      }
    })
  }

  private startNewSearch(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => params['location']),
    ).subscribe({
      next: params => {
        this.searchIsLoading = true; // Mostrar indicador de búsqueda en curso
        this.loading = true; // Mostrar indicador de carga
        const newSearch: Search = {
          dates: {
            startDate: dayjs(params["startDate"]).toDate(), // Convertir fecha de inicio
            endDate: dayjs(params["endDate"]).toDate(), // Convertir fecha de fin
          },
          infos: {
            guests: {value: params['guests']}, // Información de invitados
            bedrooms: {value: params['bedrooms']}, // Información de habitaciones
            beds: {value: params['beds']}, // Información de camas
            baths: {value: params['baths']}, // Información de baños
          },
          location: params['location'], // Ubicación
        };

        this.tenantListingService.searchListing(newSearch, this.pageRequest); // Realizar búsqueda
      }
    })
  }

  onResetSearchFilter() {
    this.router.navigate(["/"], {
      queryParams: {"category": this.categoryService.getCategoryByDefault().technicalName}
    }); // Reiniciar filtro de búsqueda
    this.loading = true; // Mostrar indicador de carga
    this.emptySearch = false; // Ocultar indicador de búsqueda vacía
  }
}

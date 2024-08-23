import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Country} from "./country.model";
import {State} from "../../../../core/model/state.model";
import {catchError, map, Observable, of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  http = inject(HttpClient);  // Inyección del servicio HttpClient

  private countries$: WritableSignal<State<Array<Country>>> =
    signal(State.Builder<Array<Country>>().forInit());  // Estado reactivo para almacenar la lista de países
  countries = computed(() => this.countries$());  // Computado para acceder al estado actual de los países

  private fetchCountry$ = new Observable<Array<Country>>();  // Observable para la lista de países

  constructor() {
    this.initFetchGetAllCountries();  // Inicializa la obtención de la lista de países
    this.fetchCountry$.subscribe();  // Inicia la suscripción al Observable
  }

  // Inicializa la obtención de todos los países desde un archivo JSON
  initFetchGetAllCountries(): void {
    this.fetchCountry$ = this.http.get<Array<Country>>("/assets/countries.json")
      .pipe(
        tap(countries =>
          this.countries$.set(State.Builder<Array<Country>>().forSuccess(countries))),  // Actualiza el estado con la lista de países
        catchError(err => {
          this.countries$.set(State.Builder<Array<Country>>().forError(err));  // Manejo de errores y actualización del estado
          return of(err);  // Devuelve un observable con el error
        }),
        shareReplay(1)  // Comparte el último valor emitido y lo vuelve a emitir a nuevos suscriptores
      );
  }

  // Obtiene un país por su código
  public getCountryByCode(code: string): Observable<Country> {
    return this.fetchCountry$.pipe(
      map(countries => countries.filter(country => country.cca3 === code)),  // Filtra la lista para encontrar el país con el código dado
      map(countries => countries[0])  // Devuelve el primer país encontrado
    );
  }
}

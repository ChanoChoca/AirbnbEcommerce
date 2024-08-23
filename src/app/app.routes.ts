import { Routes } from '@angular/router';
import { PropertiesComponent } from "./landlord/properties/properties.component";
import { authorityRouteAccess } from "./core/auth/authority-route-access";
import { HomeComponent } from "./home/home.component";
import { DisplayListingComponent } from "./tenant/display-listing/display-listing.component";
import { BookedListingComponent } from "./tenant/booked-listing/booked-listing.component";
import { ReservationComponent } from "./landlord/reservation/reservation.component";

// Definición de las rutas de la aplicación
export const routes: Routes = [
  {
    path: 'landlord/properties', // Ruta para las propiedades del arrendador
    component: PropertiesComponent, // Componente que se mostrará en esta ruta
    canActivate: [authorityRouteAccess], // Guard para verificar el acceso basado en la autoridad
    data: {
      authorities: ["ROLE_LANDLORD"] // Requiere el rol de arrendador para acceder
    }
  },
  {
    path: '', // Ruta raíz de la aplicación
    component: HomeComponent // Componente que se mostrará en la ruta raíz
  },
  {
    path: 'listing', // Ruta para ver listados
    component: DisplayListingComponent // Componente que se mostrará en esta ruta
  },
  {
    path: "booking", // Ruta para las reservas
    component: BookedListingComponent // Componente que se mostrará en esta ruta
  },
  {
    path: "landlord/reservation", // Ruta para la reserva del arrendador
    component: ReservationComponent, // Componente que se mostrará en esta ruta
    canActivate: [authorityRouteAccess], // Guard para verificar el acceso basado en la autoridad
    data: {
      authorities: ["ROLE_LANDLORD"] // Requiere el rol de arrendador para acceder
    }
  }
];

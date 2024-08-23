import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    // Proporciona la configuración de animaciones para la aplicación
    provideAnimations(),

    // Proporciona el cliente HTTP configurado con interceptores y configuración XSRF
    provideHttpClient(
      withXsrfConfiguration(
        {
          cookieName: "XSRF-TOKEN", // Nombre de la cookie utilizada para XSRF
          headerName: "X-XSRF-TOKEN" // Nombre del encabezado utilizado para XSRF
        }
      ),
    ),

    // Proporciona el enrutador configurado con las rutas de la aplicación
    provideRouter(routes)
  ]
};

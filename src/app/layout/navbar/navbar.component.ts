import { Component, effect, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/model/user.model';
import { PropertiesCreateComponent } from '../../landlord/properties-create/properties-create.component';
import { SearchComponent } from '../../tenant/search/search.component';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent
  ],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // Variables para la búsqueda
  location = "Anywhere";
  guests = "Add guests";
  dates = "Any week";

  // Servicios inyectados
  toastService = inject(ToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  ref: DynamicDialogRef | undefined;

  // Métodos para el inicio y cierre de sesión
  login = () => this.authService.login();
  logout = () => this.authService.logout();

  // Menú de navegación actual
  currentMenuItems: MenuItem[] | undefined = [];

  // Usuario conectado
  connectedUser: User = { email: this.authService.notConnected };

  constructor() {
    // Observa los cambios en el estado de autenticación del usuario
    effect(() => {
      if (this.authService.fetchUser().status === "OK") {
        this.connectedUser = this.authService.fetchUser().value!;
        this.currentMenuItems = this.fetchMenu();
      }
    });
  }

  ngOnInit(): void {
    // Fetch el estado de autenticación al iniciar
    this.authService.fetch(false);
    // Extrae información de búsqueda de los parámetros de consulta
    this.extractInformationForSearch();
  }

  // Construye el menú basado en el estado de autenticación
  private fetchMenu(): MenuItem[] {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "My booking",
          routerLink: "booking",
        },
        {
          label: "My reservation",
          routerLink: "landlord/reservation",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "Log out",
          command: this.logout
        },
      ];
    } else {
      return [
        {
          label: "Sign up",
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: "Log in",
          command: this.login
        }
      ];
    }
  }

  // Verifica si el usuario tiene el rol de "landlord"
  hasToBeLandlord(): boolean {
    return this.authService.hasAnyAuthority("ROLE_LANDLORD");
  }

  // Abre un diálogo para crear un nuevo listado
  openNewListing(): void {
    this.ref = this.dialogService.open(PropertiesCreateComponent, {
      width: "60%",
      header: "Airbnb your home",
      closable: true,
      focusOnShow: true,
      modal: true,
      showHeader: true
    });
  }

  // Abre un diálogo para la búsqueda
  openNewSearch(): void {
    this.ref = this.dialogService.open(SearchComponent, {
      width: "40%",
      header: "Search",
      closable: true,
      focusOnShow: true,
      modal: true,
      showHeader: true
    });
  }

  // Extrae información de búsqueda de los parámetros de consulta
  private extractInformationForSearch(): void {
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params["location"]) {
          this.location = params["location"];
          this.guests = params["guests"] + " Guests";
          this.dates = dayjs(params["startDate"]).format("MMM-DD")
            + " to " + dayjs(params["endDate"]).format("MMM-DD");
        } else if (this.location !== "Anywhere") {
          this.location = "Anywhere";
          this.guests = "Add guests";
          this.dates = "Any week";
        }
      }
    });
  }
}

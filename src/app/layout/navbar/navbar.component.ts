import { Component, effect, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../model/user.model';
import {AvatarComponent} from "./avatar/avatar.component";
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    AvatarComponent
  ],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // Servicios inyectados
  authService = inject(AuthService);

  toastService = inject(ToastService);

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
          label: "Log out",
          command: this.logout
        }
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
}

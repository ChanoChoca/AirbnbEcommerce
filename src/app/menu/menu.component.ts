import {Component, inject, OnInit} from '@angular/core';
import { MenuService, MenuItem, Page } from './menu.service';
import {AuthService} from "../auth/auth.service";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menus: MenuItem[] = [];
  nombre: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  authService = inject(AuthService);

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus(): void {
    this.menuService.getMenuItems(this.currentPage, this.pageSize, this.nombre, this.precioMin, this.precioMax)
      .subscribe((data: Page<MenuItem>) => {
        console.log(data); // Verifica la estructura de los datos en la consola
        this.menus = data.content;
        this.totalPages = data.page.totalPages;
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.getMenus();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getMenus();
  }

  clearFilters(): void {
    this.nombre = '';
    this.precioMin = null;
    this.precioMax = null;
    this.onSearch();
  }

  deleteMenuItem(menuItem: MenuItem): void {
    this.menuService.deleteMenuItem(menuItem.id).subscribe(() => this.getMenus());
  }
}

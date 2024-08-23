import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CategoryService } from "./category.service";
import { Category, CategoryName } from "./category.model";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  // Servicio para gestionar categorías, inyectado en el componente
  categoryService = inject(CategoryService);

  // Lista de categorías a mostrar
  categories: Category[] | undefined;

  // Categoría actualmente activada
  currentActivateCategory = this.categoryService.getCategoryByDefault();

  // Indicador para verificar si se encuentra en la página de inicio
  isHome = false;

  // Inyección de dependencias para Router y ActivatedRoute
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Inicialización del componente
    this.listenRouter();
    this.currentActivateCategory.activated = false;
    this.fetchCategories();
  }

  // Método para obtener la lista de categorías desde el servicio
  private fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }

  // Método para escuchar los eventos de navegación y manejar la activación de la categoría
  private listenRouter() {
    this.router.events.pipe(
      filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd) // Filtra solo eventos de navegación que hayan terminado
    )
      .subscribe({
        next: (evt: NavigationEnd) => {
          // Verifica si la URL actual es la página de inicio sin parámetros
          this.isHome = evt.url.split("?")[0] === "/";
          if (this.isHome && evt.url.indexOf("?") === -1) {
            // Si es la página de inicio, activa la categoría "ALL"
            const categoryByTechnicalName = this.categoryService.getCategoryByTechnicalName("ALL");
            this.categoryService.changeCategory(categoryByTechnicalName!);
          }
        },
      });

    // Escucha los parámetros de la consulta en la ruta activa
    this.activatedRoute.queryParams
      .pipe(
        map(params => params["category"]) // Mapea los parámetros de consulta para obtener el nombre de la categoría
      )
      .subscribe({
        next: (categoryName: CategoryName) => {
          // Obtiene la categoría por su nombre técnico y la activa
          const category = this.categoryService.getCategoryByTechnicalName(categoryName);
          if (category) {
            this.activateCategory(category);
            this.categoryService.changeCategory(category);
          }
        }
      })
  }

  // Activa una categoría específica
  private activateCategory(category: Category) {
    // Desactiva la categoría actualmente activada
    this.currentActivateCategory.activated = false;
    // Establece la nueva categoría como activada
    this.currentActivateCategory = category;
    this.currentActivateCategory.activated = true;
  }

  // Maneja el cambio de categoría cuando se selecciona una nueva
  onChangeCategory(category: Category) {
    this.activateCategory(category);
    // Actualiza los parámetros de consulta en la URL para reflejar la categoría seleccionada
    this.router.navigate([], {
      queryParams: { "category": category.technicalName },
      relativeTo: this.activatedRoute
    })
  }
}

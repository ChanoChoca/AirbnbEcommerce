import {Component, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Category, CategoryName} from "../../../../layout/navbar/category/category.model";
import {CategoryService} from "../../../../layout/navbar/category/category.service";

@Component({
  selector: 'app-category-step',
  standalone: true,
  imports: [
    FaIconComponent // Importa el componente para íconos de FontAwesome
  ],
  templateUrl: './category-step.component.html',
  styleUrl: './category-step.component.scss'
})
export class CategoryStepComponent implements OnInit {

  // Entrada de datos requerida: nombre de la categoría
  categoryName = input.required<CategoryName>();

  // Evento que emite el cambio en la categoría seleccionada
  @Output()
  categoryChange = new EventEmitter<CategoryName>();

  // Evento que emite la validez del paso
  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  // Servicio para manejar las categorías
  categoryService = inject(CategoryService);

  // Lista de categorías
  categories: Category[] | undefined;

  // Inicializa el componente y carga las categorías
  ngOnInit(): void {
    this.categories = this.categoryService.getCategories(); // Obtiene las categorías del servicio
  }

  // Maneja la selección de una categoría
  onSelectCategory(newCategory: CategoryName): void {
    this.categoryChange.emit(newCategory); // Emite la categoría seleccionada
    this.stepValidityChange.emit(true); // Emite que el paso es válido
  }
}

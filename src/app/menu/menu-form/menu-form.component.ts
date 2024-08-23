import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService, MenuItem } from '../menu.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit {
  menu: MenuItem = { id: 0, nombre: '', descripcion: '', precio: 0, imagen: null };
  selectedFile: File | null = null;
  isEditMode = false;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.menuService.getMenuItemById(id).subscribe(menu => {
          this.menu = menu;
        });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.menuService.updateMenu(this.menu, this.selectedFile).subscribe(
        (response) => {
          console.log('Menú actualizado:', response);
          this.router.navigate(['/menu']);
        },
        (error) => {
          console.error('Error al actualizar el menú:', error);
        }
      );
    } else {
      if (this.selectedFile) {
        this.menuService.crearMenu(this.menu, this.selectedFile).subscribe(
          (response) => {
            console.log('Menú creado:', response);
            this.router.navigate(['/menu']);
          },
          (error) => {
            console.error('Error al crear el menú:', error);
          }
        );
      }
    }
  }
}

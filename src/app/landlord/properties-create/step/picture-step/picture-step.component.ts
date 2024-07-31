import {Component, EventEmitter, input, Output} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {NewListingPicture} from "../../../model/picture.model";

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [FontAwesomeModule, InputTextModule, ButtonModule],
  templateUrl: './picture-step.component.html',
  styleUrls: ['./picture-step.component.scss'] // Corrige el nombre de la propiedad de `styleUrl` a `styleUrls`
})
export class PictureStepComponent {

  // Entrada de datos
  pictures = input.required<Array<NewListingPicture>>();

  @Output()
  picturesChange = new EventEmitter<Array<NewListingPicture>>(); // Emite los cambios en la lista de fotos

  @Output()
  stepValidityChange = new EventEmitter<boolean>(); // Emite la validez del paso

  // Extrae archivos del elemento HTML
  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  // Maneja la carga de nuevas fotos
  onUploadNewPicture(target: EventTarget | null) {
    const picturesFileList = this.extractFileFromTarget(target);
    if(picturesFileList !== null) {
      for(let i = 0 ; i < picturesFileList.length; i++) {
        const picture = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewListingPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture) // Crea una URL para mostrar la imagen
          }
          this.pictures().push(displayPicture); // Agrega la nueva imagen a la lista
        }
      }
      this.picturesChange.emit(this.pictures()); // Emite la lista actualizada de imágenes
      this.validatePictures(); // Valida las imágenes para el paso
    }
  }

  // Valida el número de imágenes para asegurar que hay al menos 5
  private validatePictures() {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true); // Emite que el paso es válido si hay al menos 5 imágenes
    } else {
      this.stepValidityChange.emit(false); // Emite que el paso no es válido si hay menos de 5 imágenes
    }
  }

  // Maneja la eliminación de una imagen
  onTrashPicture(pictureToDelete: NewListingPicture) {
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1); // Elimina la imagen de la lista
    this.validatePictures(); // Vuelve a validar las imágenes después de la eliminación
  }
}

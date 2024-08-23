import {Component, effect, inject, OnDestroy} from '@angular/core';
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {LandlordListingService} from "../landlord-listing.service";
import {ToastService} from "../../layout/toast.service";
import {AuthService} from "../../core/auth/auth.service";
import {Router} from "@angular/router";
import {Step} from "./step.model";
import {CreatedListing, Description, NewListing, NewListingInfo} from "../model/listing.model";
import {NewListingPicture} from "../model/picture.model";
import {State} from "../../core/model/state.model";
import {CategoryName} from "../../layout/navbar/category/category.model";
import {FooterStepComponent} from "../../shared/footer-step/footer-step.component";
import {CategoryStepComponent} from "./step/category-step/category-step.component";
import {LocationStepComponent} from "./step/location-step/location-step.component";
import {InfoStepComponent} from "./step/info-step/info-step.component";
import {PictureStepComponent} from "./step/picture-step/picture-step.component";
import {DescriptionStepComponent} from "./step/description-step/description-step.component";
import {PriceStepComponent} from "./step/price-step/price-step.component";
import {PriceVO} from "../model/listing-vo.model";

@Component({
  selector: 'app-properties-create',
  standalone: true,
  imports: [
    CategoryStepComponent,
    FooterStepComponent,
    LocationStepComponent,
    InfoStepComponent,
    PictureStepComponent,
    DescriptionStepComponent,
    PriceStepComponent
  ],
  templateUrl: './properties-create.component.html',
  styleUrls: ['./properties-create.component.scss']
})
export class PropertiesCreateComponent implements OnDestroy {

  // Definición de los identificadores de los pasos del formulario
  CATEGORY = "category";
  LOCATION = "location";
  INFO = "info";
  PHOTOS = "photos";
  DESCRIPTION = "description";
  PRICE = "price";

  // Inyección de servicios necesarios para el componente
  dialogDynamicRef = inject(DynamicDialogRef);
  listingService = inject(LandlordListingService);
  toastService = inject(ToastService);
  userService = inject(AuthService);
  router = inject(Router);

  // Definición de los pasos del formulario
  steps: Step[] = [
    {
      id: this.CATEGORY,
      idNext: this.LOCATION,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.LOCATION,
      idNext: this.INFO,
      idPrevious: this.CATEGORY,
      isValid: false
    },
    {
      id: this.INFO,
      idNext: this.PHOTOS,
      idPrevious: this.LOCATION,
      isValid: false
    },
    {
      id: this.PHOTOS,
      idNext: this.DESCRIPTION,
      idPrevious: this.INFO,
      isValid: false
    },
    {
      id: this.DESCRIPTION,
      idNext: this.PRICE,
      idPrevious: this.PHOTOS,
      isValid: false
    },
    {
      id: this.PRICE,
      idNext: null,
      idPrevious: this.DESCRIPTION,
      isValid: false
    }
  ];

  currentStep = this.steps[0]; // Paso actual del formulario

  // Inicialización de un nuevo listado
  newListing: NewListing = {
    category: "AMAZING_VIEWS",
    infos: {
      guests: {value: 0},
      bedrooms: {value: 0},
      beds: {value: 0},
      baths: {value: 0}
    },
    location: "",
    pictures: new Array<NewListingPicture>(),
    description: {
      title: {value: ""},
      description: {value: ""}
    },
    price: {value: 0}
  };

  loadingCreation = false; // Estado de carga para la creación del listado

  constructor() {
    this.listenFetchUser(); // Configura la escucha para la obtención del usuario
    this.listenListingCreation(); // Configura la escucha para la creación del listado
  }

  // Método para crear un nuevo listado
  createListing(): void {
    this.loadingCreation = true; // Marca el estado de carga
    this.listingService.create(this.newListing); // Llama al servicio para crear el listado
  }

  // Método del ciclo de vida de Angular llamado al destruir el componente
  ngOnDestroy(): void {
    this.listingService.resetListingCreation(); // Reinicia el estado de creación del listado
  }

  // Configura la escucha para la obtención del usuario
  listenFetchUser() {
    effect(() => {
      if (this.userService.fetchUser().status === "OK"
        && this.listingService.createSig().status === "OK") {
        this.router.navigate(["landlord", "properties"]); // Redirige si el usuario y el listado fueron obtenidos correctamente
      }
    });
  }

  // Configura la escucha para la creación del listado
  listenListingCreation() {
    effect(() => {
      let createdListingState = this.listingService.createSig();
      if (createdListingState.status === "OK") {
        this.onCreateOk(createdListingState); // Maneja el caso cuando la creación es exitosa
      } else if (createdListingState.status === "ERROR") {
        this.onCreateError(); // Maneja el caso cuando ocurre un error
      }
    });
  }

  // Maneja el caso cuando la creación del listado es exitosa
  onCreateOk(createdListingState: State<CreatedListing>) {
    this.loadingCreation = false; // Marca el final del estado de carga
    this.toastService.send({
      severity: "success", summary: "Success", detail: "Listing created successfully.",
    });
    this.dialogDynamicRef.close(createdListingState.value?.publicId); // Cierra el diálogo y pasa el ID del nuevo listado
    this.userService.fetch(true); // Refresca la información del usuario
  }

  // Maneja el caso cuando ocurre un error en la creación del listado
  private onCreateError() {
    this.loadingCreation = false; // Marca el final del estado de carga
    this.toastService.send({
      severity: "error", summary: "Error", detail: "Couldn't create your listing, please try again.",
    });
  }

  // Avanza al siguiente paso del formulario
  nextStep(): void {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  // Retrocede al paso anterior del formulario
  previousStep(): void {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  // Verifica si todos los pasos del formulario son válidos
  isAllStepsValid(): boolean {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  // Actualiza la categoría del nuevo listado
  onCategoryChange(newCategory: CategoryName): void {
    this.newListing.category = newCategory;
  }

  // Actualiza la validez del paso actual
  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  // Actualiza la ubicación del nuevo listado
  onLocationChange(newLocation: string) {
    this.newListing.location = newLocation;
  }

  // Actualiza la información del nuevo listado
  onInfoChange(newInfo: NewListingInfo) {
    this.newListing.infos = newInfo;
  }

  // Actualiza las fotos del nuevo listado
  onPictureChange(newPictures: NewListingPicture[]) {
    this.newListing.pictures = newPictures;
  }

  // Actualiza la descripción del nuevo listado
  onDescriptionChange(newDescription: Description) {
    this.newListing.description = newDescription;
  }

  // Actualiza el precio del nuevo listado
  onPriceChange(newPrice: PriceVO) {
    this.newListing.price = newPrice;
  }
}

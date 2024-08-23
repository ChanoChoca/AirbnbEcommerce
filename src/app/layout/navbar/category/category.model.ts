import { IconName } from "@fortawesome/free-regular-svg-icons";

// Tipo de unión que define todos los nombres técnicos posibles para las categorías
export type CategoryName =
  | "ALL"
  | "AMAZING_VIEWS"
  | "OMG"
  | "TREEHOUSES"
  | "BEACH"
  | "FARMS"
  | "TINY_HOMES"
  | "LAKE"
  | "CONTAINERS"
  | "CAMPING"
  | "CASTLE"
  | "SKIING"
  | "CAMPERS"
  | "ARTIC"
  | "BOAT"
  | "BED_AND_BREAKFASTS"
  | "ROOMS"
  | "EARTH_HOMES"
  | "TOWER"
  | "CAVES"
  | "LUXES"
  | "CHEFS_KITCHEN";

// Interfaz que define la estructura de una categoría
export interface Category {
  icon: IconName;            // Nombre del ícono asociado a la categoría (de FontAwesome)
  displayName: string;       // Nombre que se mostrará en la interfaz de usuario
  technicalName: CategoryName; // Nombre técnico utilizado internamente para identificar la categoría
  activated: boolean;        // Estado que indica si la categoría está activada o no
}

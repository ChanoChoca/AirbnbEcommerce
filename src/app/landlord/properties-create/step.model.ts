// Define la interfaz Step que representa un paso en un formulario de varios pasos
export interface Step {
  // Identificador único del paso
  id: string;

  // Identificador del siguiente paso; puede ser null si no hay un siguiente paso
  idNext: string | null;

  // Identificador del paso anterior; puede ser null si no hay un paso anterior
  idPrevious: string | null;

  // Indica si el paso actual es válido o no
  isValid: boolean;
}

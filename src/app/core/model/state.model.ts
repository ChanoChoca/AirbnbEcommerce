import {HttpErrorResponse} from '@angular/common/http'; // Importar HttpErrorResponse

// Tipo para las notificaciones de estado
export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

// Clase genérica para gestionar el estado
export class State<T, V = HttpErrorResponse> {
  value?: T; // Valor opcional
  error?: V | HttpErrorResponse; // Error opcional que puede ser del tipo V o HttpErrorResponse
  status: StatusNotification; // Estado de la notificación

  // Constructor para inicializar el estado, valor y error
  constructor(status: StatusNotification, value?: T, error?: V | HttpErrorResponse) {
    this.value = value;
    this.error = error;
    this.status = status;
  }

  // Método estático para crear un nuevo StateBuilder
  static Builder<T = any, V = HttpErrorResponse>() {
    return new StateBuilder<T, V>();
  }
}

// Clase para construir instancias de State
class StateBuilder<T, V = HttpErrorResponse> {
  private status: StatusNotification = 'INIT'; // Estado inicial por defecto
  private value?: T; // Valor opcional
  private error?: V | HttpErrorResponse; // Error opcional que puede ser del tipo V o HttpErrorResponse

  // Método para configurar un estado de éxito
  public forSuccess(value: T): State<T, V> {
    this.value = value;
    return new State<T, V>('OK', this.value, this.error);
  }

  // Método para configurar un estado de error
  public forError(error: V | HttpErrorResponse = new HttpErrorResponse({ error: 'Unknown Error' }), value?: T): State<T, V> {
    this.value = value;
    this.error = error;
    return new State<T, V>('ERROR', this.value, this.error);
  }

  // Método para configurar un estado inicial
  public forInit(): State<T, V> {
    return new State<T, V>('INIT', this.value, this.error);
  }
}

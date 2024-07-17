import { HttpErrorResponse } from "@angular/common/http";

// Tipo para notificar el estado, puede ser 'OK', 'ERROR' o 'INIT'.
export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

// Clase genérica State que representa el estado de una operación con valor, error y estado.
export class State<T, V = HttpErrorResponse> {
  value?: T;
  error?: V | HttpErrorResponse;
  status: StatusNotification;

  constructor(status: StatusNotification, value?: T, error?: V | HttpErrorResponse) {
    this.value = value;
    this.error = error;
    this.status = status;
  }

  // Método estático para crear un constructor de estado (StateBuilder).
  static Builder<T = any, V = HttpErrorResponse>() {
    return new StateBuilder<T, V>();
  }
}

// Clase StateBuilder para construir instancias de State con diferentes estados.
class StateBuilder<T, V = HttpErrorResponse> {
  private status: StatusNotification = 'INIT';
  private value?: T;
  private error?: V | HttpErrorResponse;

  // Método para construir un estado de éxito.
  public forSuccess(value: T): State<T, V> {
    this.value = value;
    return new State<T, V>('OK', this.value, this.error);
  }

  // Método para construir un estado de error.
  public forError(error: V | HttpErrorResponse = new HttpErrorResponse({error: 'Unknown Error'}), value?: T): State<T, V> {
    this.value = value;
    this.error = error;
    return new State<T, V>('ERROR', this.value, this.error);
  }

  // Método para construir un estado de inicialización.
  public forInit(): State<T, V> {
    return new State<T, V>('INIT', this.value, this.error);
  }
}

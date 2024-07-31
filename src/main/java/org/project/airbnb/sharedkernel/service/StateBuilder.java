package org.project.airbnb.sharedkernel.service;

/**
 * Builder para construir instancias de {@link State}.
 *
 * @param <T> Tipo del valor resultante de la operación.
 * @param <V> Tipo del error, si existe.
 */
public class StateBuilder<T, V> {
    private StatusNotification status; // Estado de la operación.
    private T value;                   // Valor resultante de la operación.
    private V error;                   // Error que ocurrió durante la operación.

    /**
     * Configura el estado para un error y devuelve una nueva instancia de {@link State}.
     *
     * @param error Error que ocurrió.
     * @return Una nueva instancia de {@link State} con el estado de error.
     */
    public State<T, V> forError(V error) {
        this.error = error;
        this.status = StatusNotification.ERROR;
        return new State<>(this.status, this.value, this.error);
    }

    /**
     * Configura el estado para un éxito sin valor y devuelve una nueva instancia de {@link State}.
     *
     * @return Una nueva instancia de {@link State} con el estado de éxito sin valor.
     */
    public State<T, V> forSuccess() {
        this.status = StatusNotification.OK;
        return new State<>(this.status, this.value, this.error);
    }

    /**
     * Configura el estado para un éxito con un valor y devuelve una nueva instancia de {@link State}.
     *
     * @param value Valor resultante de la operación.
     * @return Una nueva instancia de {@link State} con el estado de éxito y el valor proporcionado.
     */
    public State<T, V> forSuccess(T value) {
        this.value = value;
        this.status = StatusNotification.OK;
        return new State<>(this.status, this.value, this.error);
    }

    /**
     * Configura el estado para una autorización fallida y devuelve una nueva instancia de {@link State}.
     *
     * @param error Error que ocurrió durante la autorización.
     * @return Una nueva instancia de {@link State} con el estado de autorización fallida.
     */
    public State<T, V> forUnauthorized(V error) {
        this.error = error;
        this.status = StatusNotification.UNAUTHORIZED;
        return new State<>(this.status, this.value, this.error);
    }
}

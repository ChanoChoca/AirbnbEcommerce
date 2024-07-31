package org.project.airbnb.sharedkernel.service;

import org.project.airbnb.sharedkernel.service.StateBuilder;
import org.project.airbnb.sharedkernel.service.StatusNotification;

/**
 * Representa el estado de una operación, que incluye un valor, un error y el estado de la operación.
 * 
 * @param <T> Tipo del valor resultante de la operación.
 * @param <V> Tipo del error, si existe.
 */
public class State<T, V> {
    private T value;            // Valor resultante de la operación, si es exitoso.
    private V error;            // Error que ocurrió durante la operación, si existe.
    private StatusNotification status;  // Estado de la operación (éxito, fallo, etc.).

    /**
     * Constructor de la clase State.
     *
     * @param status Estado de la operación.
     * @param value Valor resultante de la operación.
     * @param error Error que ocurrió durante la operación.
     */
    public State(StatusNotification status, T value, V error) {
        this.value = value;
        this.error = error;
        this.status = status;
    }

    /**
     * Obtiene el valor resultante de la operación.
     *
     * @return Valor resultante.
     */
    public T getValue() {
        return value;
    }

    /**
     * Establece el valor resultante de la operación.
     *
     * @param value Valor resultante.
     */
    public void setValue(T value) {
        this.value = value;
    }

    /**
     * Obtiene el error que ocurrió durante la operación.
     *
     * @return Error que ocurrió.
     */
    public V getError() {
        return error;
    }

    /**
     * Establece el error que ocurrió durante la operación.
     *
     * @param error Error que ocurrió.
     */
    public void setError(V error) {
        this.error = error;
    }

    /**
     * Obtiene el estado de la operación.
     *
     * @return Estado de la operación.
     */
    public StatusNotification getStatus() {
        return status;
    }

    /**
     * Establece el estado de la operación.
     *
     * @param status Estado de la operación.
     */
    public void setStatus(StatusNotification status) {
        this.status = status;
    }

    /**
     * Crea un builder para construir instancias de State.
     *
     * @param <T> Tipo del valor resultante de la operación.
     * @param <V> Tipo del error, si existe.
     * @return Un builder para construir instancias de State.
     */
    public static <T, V> StateBuilder<T, V> builder() {
        return new StateBuilder<>();
    }
}

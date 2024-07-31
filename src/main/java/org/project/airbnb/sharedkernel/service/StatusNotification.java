package org.project.airbnb.sharedkernel.service;

/**
 * Enum que representa los posibles estados de notificación de una operación.
 */
public enum StatusNotification {
    /**
     * Estado que indica que la operación fue exitosa.
     */
    OK,

    /**
     * Estado que indica que ocurrió un error durante la operación.
     */
    ERROR,

    /**
     * Estado que indica que la operación falló debido a falta de autorización.
     */
    UNAUTHORIZED;
}

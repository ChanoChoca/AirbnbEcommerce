package org.project.airbnb.user.application;

/**
 * Excepción personalizada para manejar errores relacionados con usuarios.
 */
public class UserException extends RuntimeException {

    /**
     * Constructor que inicializa la excepción con un mensaje específico.
     *
     * @param message Mensaje de error que se pasa a la excepción.
     */
    public UserException(String message) {
        super(message); // Llama al constructor de la superclase RuntimeException con el mensaje proporcionado
    }
}

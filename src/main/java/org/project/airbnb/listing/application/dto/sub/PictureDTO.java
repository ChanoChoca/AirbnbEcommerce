package org.project.airbnb.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;
import java.util.Objects;

/**
 * DTO para representar una imagen en el sistema.
 */
public record PictureDTO(
        @NotNull byte[] file,                // Contenido del archivo de la imagen. No puede ser nulo.
        @NotNull String fileContentType,     // Tipo de contenido del archivo (por ejemplo, "image/jpeg"). No puede ser nulo.
        @NotNull boolean isCover              // Indica si la imagen es una portada. No puede ser nulo.
) {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                     // Si ambos objetos son idénticos, son iguales.
        if (o == null || getClass() != o.getClass()) return false; // Si el objeto es nulo o de una clase diferente, no son iguales.
        PictureDTO that = (PictureDTO) o;               // Cast del objeto a PictureDTO.
        return isCover == that.isCover &&              // Compara el valor de isCover.
                Objects.equals(fileContentType, that.fileContentType); // Compara el fileContentType.
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileContentType, isCover); // Calcula el código hash basado en fileContentType e isCover.
    }

    @Override
    public String toString() {
        return "PictureDTO{" +
                "fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}'; // Representación en cadena del objeto.
    }
}

package org.project.airbnb.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "authority")
public class Authority implements Serializable {

    @NotNull
    @Size(max=50)
    @Id
    @Column(length = 50)
    private String name;

    /**
     * Obtiene el nombre de la autoridad.
     *
     * @return Nombre de la autoridad.
     */
    public String getName() {
        return name;
    }

    /**
     * Establece el nombre de la autoridad.
     *
     * @param name Nombre de la autoridad.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Compara esta autoridad con otro objeto para verificar si son iguales.
     *
     * @param o Objeto con el que comparar.
     * @return Verdadero si son iguales, falso de lo contrario.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Authority authority = (Authority) o;
        return Objects.equals(name, authority.name);
    }

    /**
     * Calcula el código hash de esta autoridad.
     *
     * @return Código hash de la autoridad.
     */
    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    /**
     * Representa esta autoridad como una cadena.
     *
     * @return Cadena que representa la autoridad.
     */
    @Override
    public String toString() {
        return "Authority{" +
                "name='" + name + '\'' +
                '}';
    }
}

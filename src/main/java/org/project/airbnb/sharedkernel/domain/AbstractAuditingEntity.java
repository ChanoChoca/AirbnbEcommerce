package org.project.airbnb.sharedkernel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;

/**
 * Clase base abstracta para entidades que necesitan ser auditadas en términos de creación y modificación.
 * Utiliza anotaciones de Spring Data JPA para gestionar las fechas de creación y modificación automáticamente.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditingEntity<T> implements Serializable {

    /**
     * Método abstracto para obtener el identificador de la entidad.
     * Debe ser implementado por las subclases.
     *
     * @return Identificador de la entidad.
     */
    public abstract T getId();

    /**
     * Fecha en la que la entidad fue creada.
     * La anotación @CreatedDate indica que esta fecha debe ser establecida automáticamente
     * al momento de la creación de la entidad.
     */
    @CreatedDate
    @Column(updatable = false, name = "created_date")
    private Instant createdDate = Instant.now();

    /**
     * Fecha en la que la entidad fue modificada por última vez.
     * La anotación @LastModifiedDate indica que esta fecha debe ser actualizada automáticamente
     * cada vez que la entidad se modifica.
     */
    @LastModifiedDate
    @Column(name = "last_modified_date")
    private Instant lastModifiedDate = Instant.now();

    /**
     * Obtiene la fecha de creación de la entidad.
     *
     * @return Fecha de creación.
     */
    public Instant getCreatedDate() {
        return createdDate;
    }

    /**
     * Establece la fecha de creación de la entidad.
     *
     * @param createdDate Fecha de creación.
     */
    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    /**
     * Obtiene la fecha de la última modificación de la entidad.
     *
     * @return Fecha de la última modificación.
     */
    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    /**
     * Establece la fecha de la última modificación de la entidad.
     *
     * @param lastModifiedDate Fecha de la última modificación.
     */
    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}

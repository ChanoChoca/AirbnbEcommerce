package org.project.airbnb.listing.application.dto;

import org.project.airbnb.listing.application.dto.sub.DescriptionDTO;
import org.project.airbnb.listing.application.dto.sub.ListingInfoDTO;
import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.application.dto.vo.PriceVO;
import org.project.airbnb.listing.domain.BookingCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * DTO para guardar o actualizar la información de un listado.
 */
public class SaveListingDTO {

    @NotNull
    private BookingCategory category; // Categoría de la reserva

    @NotNull
    private String location; // Ubicación del listado

    @NotNull
    @Valid
    private ListingInfoDTO infos; // Información del listado

    @NotNull
    @Valid
    private DescriptionDTO description; // Descripción del listado

    @NotNull
    @Valid
    private PriceVO price; // Precio del listado

    @NotNull
    private List<PictureDTO> pictures; // Lista de fotos del listado

    // Getters y Setters

    public BookingCategory getCategory() {
        return category;
    }

    public void setCategory(BookingCategory category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ListingInfoDTO getInfos() {
        return infos;
    }

    public void setInfos(ListingInfoDTO infos) {
        this.infos = infos;
    }

    public DescriptionDTO getDescription() {
        return description;
    }

    public void setDescription(DescriptionDTO description) {
        this.description = description;
    }

    public PriceVO getPrice() {
        return price;
    }

    public void setPrice(PriceVO price) {
        this.price = price;
    }

    public List<PictureDTO> getPictures() {
        return pictures;
    }

    public void setPictures(List<PictureDTO> pictures) {
        this.pictures = pictures;
    }
}

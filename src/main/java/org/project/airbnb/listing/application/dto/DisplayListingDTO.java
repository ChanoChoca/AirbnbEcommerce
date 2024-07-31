package org.project.airbnb.listing.application.dto;

import org.project.airbnb.listing.application.dto.sub.DescriptionDTO;
import org.project.airbnb.listing.application.dto.sub.LandlordListingDTO;
import org.project.airbnb.listing.application.dto.sub.ListingInfoDTO;
import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.application.dto.vo.PriceVO;
import org.project.airbnb.listing.domain.BookingCategory;

import java.util.List;

/**
 * DTO (Data Transfer Object) para representar la información detallada de un listado.
 */
public class DisplayListingDTO {

    private DescriptionDTO description;  // Descripción del listado.
    private List<PictureDTO> pictures;    // Lista de imágenes del listado.
    private ListingInfoDTO infos;         // Información adicional sobre el listado.
    private PriceVO price;                // Precio del listado.
    private BookingCategory category;     // Categoría de reserva del listado.
    private String location;              // Ubicación del listado.
    private LandlordListingDTO landlord;  // Información sobre el arrendador.

    // Getters y Setters
    public DescriptionDTO getDescription() {
        return description;
    }

    public void setDescription(DescriptionDTO description) {
        this.description = description;
    }

    public List<PictureDTO> getPictures() {
        return pictures;
    }

    public void setPictures(List<PictureDTO> pictures) {
        this.pictures = pictures;
    }

    public ListingInfoDTO getInfos() {
        return infos;
    }

    public void setInfos(ListingInfoDTO infos) {
        this.infos = infos;
    }

    public PriceVO getPrice() {
        return price;
    }

    public void setPrice(PriceVO price) {
        this.price = price;
    }

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

    public LandlordListingDTO getLandlord() {
        return landlord;
    }

    public void setLandlord(LandlordListingDTO landlord) {
        this.landlord = landlord;
    }
}

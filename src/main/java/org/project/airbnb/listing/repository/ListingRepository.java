package org.project.airbnb.listing.repository;

import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.domain.BookingCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<org.project.airbnb.listing.domain.Listing, Long> {

    @Query("SELECT listing FROM Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE listing.landlordPublicId = :landlordPublicId AND picture.isCover = true")
    List<org.project.airbnb.listing.domain.Listing> findAllByLandlordPublicIdFetchCoverPicture(UUID landlordPublicId);

    long deleteByPublicIdAndLandlordPublicId(UUID publicId, UUID landlordPublicId);

    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true AND listing.bookingCategory = :bookingCategory")
    Page<org.project.airbnb.listing.domain.Listing> findAllByBookingCategoryWithCoverOnly(Pageable pageable, BookingCategory bookingCategory);

    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true")
    Page<org.project.airbnb.listing.domain.Listing> findAllWithCoverOnly(Pageable pageable);

    Optional<org.project.airbnb.listing.domain.Listing> findByPublicId(UUID publicId);

    List<org.project.airbnb.listing.domain.Listing> findAllByPublicIdIn(List<UUID> allListingPublicIDs);

    Optional<org.project.airbnb.listing.domain.Listing> findOneByPublicIdAndLandlordPublicId(UUID listingPublicId, UUID landlordPublicId);

    Page<org.project.airbnb.listing.domain.Listing> findAllByLocationAndBathroomsAndBedroomsAndGuestsAndBeds(
            Pageable pageable, String location, int bathrooms, int bedrooms, int guests, int beds
    );
}

package org.project.airbnb.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({"org.project.airbnb.user.repository",
        "org.project.airbnb.listing.repository",
        "org.project.airbnb.booking.repository"})
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@EnableTransactionManagement
@EnableJpaAuditing
public class DatabaseConfiguration {
}

package org.project.airbnb.user.mapper;

import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.project.airbnb.user.domain.Authority;
import org.project.airbnb.user.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    ReadUserDTO readUserDTOToUser(User user);

    default String mapAuthoritiesToString(Authority authority) {
        return authority.getName();
    }

}

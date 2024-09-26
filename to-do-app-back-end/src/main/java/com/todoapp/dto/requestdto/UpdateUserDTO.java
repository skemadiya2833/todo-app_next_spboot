package com.todoapp.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserDTO {

    @NotBlank(message = "First Name is required.")
    @Size(max = 50, message = "First Name must be less than or equal to 50 characters.")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "First Name must not contain numbers or special characters.")
    private String firstName;

    @NotBlank(message = "Last Name is required.")
    @Size(max = 50, message = "Last Name must be less than or equal to 50 characters.")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Last Name must not contain numbers or special characters.")
    private String lastName;
}

package com.todoapp.dto.requestdto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserDto {

    @NotBlank(message = "First Name is required.")
    @Size(max = 50, message = "First Name must be less than or equal to 50 characters.")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "First Name must not contain numbers or special characters.")
    private String firstName;

    @NotBlank(message = "Last Name is required.")
    @Size(max = 50, message = "Last Name must be less than or equal to 50 characters.")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Last Name must not contain numbers or special characters.")
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    @Size(max = 100, message = "Email must be less than or equal to 100 characters.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$", message = "Password must contain at least one letter and one number.")
    private String password;

}
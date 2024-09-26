package com.todoapp.dto.requestdto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginUserDto {

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    @Size(max = 100, message = "Email must be less than or equal to 100 characters.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$", message = "Password must contain at least one letter and one number.")
    private String password;

}
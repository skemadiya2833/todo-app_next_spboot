package com.todoapp.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

	private String token;

	private UserDetails user;
}
package com.todoapp.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetails {

	private Long id;

	private String firstName;

	private String lastName;

	private String email;

}

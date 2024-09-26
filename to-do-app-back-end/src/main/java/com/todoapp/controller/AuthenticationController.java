package com.todoapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.dto.requestdto.LoginUserDto;
import com.todoapp.dto.requestdto.RegisterUserDto;
import com.todoapp.dto.responsedto.LoginResponse;
import com.todoapp.service.AuthenticationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

	@Autowired
	private AuthenticationService authenticationService;

	@PostMapping("/signup")
	public ResponseEntity<LoginResponse> register(@RequestBody @Valid RegisterUserDto registerUserDto) {

		return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.signup(registerUserDto));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody @Valid LoginUserDto loginUserDto) {

		return ResponseEntity.ok(authenticationService.authenticate(loginUserDto));
	}

}
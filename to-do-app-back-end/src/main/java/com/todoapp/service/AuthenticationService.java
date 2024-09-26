package com.todoapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.todoapp.dto.requestdto.LoginUserDto;
import com.todoapp.dto.requestdto.RegisterUserDto;
import com.todoapp.dto.responsedto.LoginResponse;
import com.todoapp.dto.responsedto.UserDetails;
import com.todoapp.entity.User;
import com.todoapp.repository.UserRepository;

@Service
public class AuthenticationService {

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserRepository userRepository;

	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

	private LoginResponse generateResponse(User user) {

		UserDetails userDetails = new UserDetails(user.getId(), user.getFirstName(), user.getLastName(),
				user.getEmail());
		String jwtToken = jwtService.generateToken(userDetails);
		return new LoginResponse(jwtToken, userDetails);
	}

	public LoginResponse signup(RegisterUserDto input) {

		Optional<User> existingOptionalUser = userRepository.findByEmail(input.getEmail());
		if (existingOptionalUser.isPresent()) {
			User existingUser = existingOptionalUser.get();
			if (existingUser.isDeleted()) {
				existingUser.setDeleted(false);
				existingUser.setFirstName(input.getFirstName());
				existingUser.setLastName(input.getLastName());
				existingUser.setPassword(encoder.encode(input.getPassword()));
				return generateResponse(userRepository.save(existingUser));
			}
			throw new DataIntegrityViolationException("Record Already Exists");
		}

		User user = new User(null, input.getFirstName(), input.getLastName(), input.getEmail(),
				encoder.encode(input.getPassword()), false);

		return generateResponse(userRepository.save(user));
	}

	public LoginResponse authenticate(LoginUserDto input) {

		Optional<User> optionalUser = userRepository.findNotDeletedUserByEmail(input.getEmail());
		if (optionalUser.isEmpty())
			throw new UsernameNotFoundException("User does not exists");
		User user = optionalUser.get();
		if (encoder.matches(input.getPassword(), user.getPassword())) {
			return generateResponse(user);
		}
		throw new BadCredentialsException("Invalid Username or Password");
	}
}

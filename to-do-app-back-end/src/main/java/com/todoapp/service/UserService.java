package com.todoapp.service;

import java.util.Optional;

import javax.security.auth.login.AccountNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.todoapp.dto.requestdto.UpdateUserDTO;
import com.todoapp.dto.requestdto.UserDeleteDTO;
import com.todoapp.dto.responsedto.UserDetails;
import com.todoapp.entity.User;
import com.todoapp.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

	public User loadUserByUsername(String email) throws AccountNotFoundException {
		Optional<User> optionalUser = userRepository.findNotDeletedUserByEmail(email);
		if (optionalUser.isEmpty() || optionalUser.get().isDeleted())
			throw new AccountNotFoundException("User Not Found");
		return optionalUser.get();
	}

	public UserDetails updateUser(Long id, UpdateUserDTO updateUserDTO) throws AccountNotFoundException {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isEmpty() || optionalUser.get().isDeleted())
			throw new AccountNotFoundException("User Not Found");
		User user = optionalUser.get();
		user.setFirstName(updateUserDTO.getFirstName());
		user.setLastName(updateUserDTO.getLastName());
		User updatedUser = userRepository.save(user);
		return new UserDetails(updatedUser.getId(), updatedUser.getFirstName(), updatedUser.getLastName(),
				updatedUser.getEmail());
	}

	public void deleteUser(Long id, UserDeleteDTO userDeleteDTO) throws AccountNotFoundException {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isEmpty() || optionalUser.get().isDeleted())
			throw new AccountNotFoundException("User Not Found");
		User user = optionalUser.get();
		if (encoder.matches(userDeleteDTO.getPassword(), user.getPassword())) {
			user.setDeleted(true);
			userRepository.save(user);
			return;
		}
		throw new BadCredentialsException("Invalid Password");
	}
}

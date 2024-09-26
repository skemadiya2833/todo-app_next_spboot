package com.todoapp.exceptionhandler;

import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.Map;
import java.util.HashMap;
import java.util.NoSuchElementException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.todoapp.dto.responsedto.ExceptionMessage;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public Map<String, String> handleValidationException(MethodArgumentNotValidException e) {
		Map<String, String> errors = new HashMap<String, String>();
		e.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName;
			try {
				fieldName = ((FieldError) error).getField();
			} catch (ClassCastException ex) {
				fieldName = error.getObjectName();
			}
			errors.put(fieldName, error.getDefaultMessage());
		});
		return errors;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ExceptionMessage handleUniqueKeyConflict(DataIntegrityViolationException e) {
		return new ExceptionMessage(e.getMessage());
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MultipartException.class)
	public ExceptionMessage handleMultiparException(MultipartException e) {
		return new ExceptionMessage(e.getLocalizedMessage());
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(IllegalArgumentException.class)
	public ExceptionMessage handleIllegalArgumentException(IllegalArgumentException e) {
		return new ExceptionMessage(e.getLocalizedMessage());
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ExceptionMessage handleHTTPexception() {
		return new ExceptionMessage("Content Type not readable");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ExceptionMessage handleMissingServletRequestParameterException() {
		return new ExceptionMessage("Please provide required parameters");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageConversionException.class)
	public ExceptionMessage handleHTTPConversionexception() {
		return new ExceptionMessage("Cannot Parse HTTP message");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	public ExceptionMessage handleHttpMediaTypeNotSupportedException() {
		return new ExceptionMessage("Content Type not readable");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(InvalidParameterException.class)
	public ExceptionMessage handleInvalidParameterException(InvalidParameterException e) {
		return new ExceptionMessage(e.getMessage());
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ExceptionMessage handleMethodArgumentTypeMismatchException() {
		return new ExceptionMessage("Parameters Mismatched");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(NullPointerException.class)
	public ExceptionMessage handleNullPointerException() {
		return new ExceptionMessage("Please Login and try again.");
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(InvalidDataAccessApiUsageException.class)
	public ExceptionMessage handleInvalidDataAccessApiUsageException() {
		return new ExceptionMessage("Cannot Insert Records");
	}

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(BadCredentialsException.class)
	public ExceptionMessage handleBadCredentialsException() {
		return new ExceptionMessage("Invalid Email or Password");
	}

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(NoSuchElementException.class)
	public ExceptionMessage handleNoSuchElementException() {
		return new ExceptionMessage("Token is required");
	}

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(JwtException.class)
	public ExceptionMessage JwtException(JwtException e) {
		return new ExceptionMessage(e.getMessage());
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(SignatureException.class)
	public ExceptionMessage handleMissingSignatureException() {
		return new ExceptionMessage("The JWT signature is invalid");
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(ExpiredJwtException.class)
	public ExceptionMessage handleExpiredJwtException() {
		return new ExceptionMessage("The JWT token has expired, Please Login Again");
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(MalformedJwtException.class)
	public ExceptionMessage handleMalformedJwtException() {
		return new ExceptionMessage("Invalid token (JWT Malformed)");
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoResourceFoundException.class)
	public ExceptionMessage handleResourcesNotFoundException() {
		return new ExceptionMessage("Looks like you have mistyped url");
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NotFoundException.class)
	public ExceptionMessage handleNotFoundException() {
		return new ExceptionMessage("Resource you're looking for is not avaialable.");
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(UsernameNotFoundException.class)
	public ExceptionMessage handleUsernameNotFoundException() {
		return new ExceptionMessage("User Does not Exist");
	}

	@ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ExceptionMessage handleMethodNotSupportedException() {
		return new ExceptionMessage("This Method is not supported here");
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(IOException.class)
	public ExceptionMessage handleIOException(IOException e) {
		e.printStackTrace();
		return new ExceptionMessage(e.getMessage());
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	public ExceptionMessage handleException(Exception e) {
		e.printStackTrace();
		return new ExceptionMessage("Unknown Error Occured");
	}
}
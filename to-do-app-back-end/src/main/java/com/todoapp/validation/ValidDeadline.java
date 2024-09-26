package com.todoapp.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = DeadlineAfterValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDeadline {
    String message() default "Deadline must be after startDateTime and reminder";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

package com.todoapp.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ReminderBetweenValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidReminder {
    String message() default "Reminder must be after startDateTime and before deadline";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

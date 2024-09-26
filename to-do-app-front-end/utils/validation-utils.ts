export const validateFirstName = (firstName: string): string | null => {
  if (!firstName.trim()) {
    return "First Name is required.";
  }
  if (firstName.length > 50) {
    return "First Name must be less than or equal to 50 characters.";
  }
  if (!/^[a-zA-Z]+$/.test(firstName)) {
    return "First Name must not contain numbers or special characters.";
  }

  return null;
};

export const validateLastName = (lastName: string): string | null => {
  if (!lastName.trim()) {
    return "Last Name is required.";
  }
  if (lastName.length > 50) {
    return "Last Name must be less than or equal to 50 characters.";
  }
  if (!/^[a-zA-Z]+$/.test(lastName)) {
    return "Last Name must not contain numbers or special characters.";
  }

  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email format.";
  }
  if (email.length > 100) {
    return "Email must be less than or equal to 100 characters.";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }

  return null;
};

export const validateFormDates = ({ startDateTime, deadline, reminder }: { startDateTime: Date, deadline: Date, reminder: Date }) => {
  const result: {
    reminderError: null | string, 
    deadlineError: null | string
  } = {
    reminderError: null, 
    deadlineError: null
  }
  if(startDateTime > reminder){
    result.reminderError = "Reminder cannot be set before Starting Time of task";
  }
  if(deadline < startDateTime){
    result.deadlineError = "Deadline cannot be set before Starting Time of task";
  }
  return result ;
} 
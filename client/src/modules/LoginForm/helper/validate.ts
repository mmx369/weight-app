export function emailValidation(email: string): boolean {
  const mailformat =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  const normilizedEmail = email.trim()
  if (normilizedEmail.match(mailformat)) {
    return true
  } else {
    return false
  }
}

export function passwordValidation(password: string): boolean {
  //1 lowercase, 1 uppercase, 1 numeric, min 8 chars
  const strongPasswordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
  )
  if (password.trim().match(strongPasswordRegex)) {
    return true
  } else {
    return false
  }
}

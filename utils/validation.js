/* Validate postal code */
export function validatePostalCode(postalCode) {
  return /[A-Z][0-9][A-Z]( )?[0-9][A-Z][0-9]/.test(postalCode.toUpperCase())
}

/* Validate email address */
export function validateEmail(emailAddress) {
  return /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)
}

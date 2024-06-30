export class UserDto {
  email
  id
  isActivated
  firstName
  familyName
  dateOfBirth
  height
  constructor(model: any) {
    this.email = model.email
    this.id = model._id
    this.isActivated = model.isActivated
    this.firstName = model.firstName
    this.familyName = model.familyName
    this.dateOfBirth = model.dateOfBirth
    this.height = model.height
  }
}

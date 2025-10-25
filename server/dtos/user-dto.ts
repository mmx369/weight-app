export class UserDto {
  email;
  id;
  isActivated;
  firstName;
  familyName;
  dateOfBirth;
  height;
  gender;
  createdAt;
  constructor(model: any) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.firstName = model.firstName;
    this.familyName = model.familyName;
    this.dateOfBirth = model.dateOfBirth;
    this.height = model.height;
    this.gender = model.gender;
    this.createdAt =
      model.createdAt ||
      (model._id ? new Date(model._id.getTimestamp()) : null);
  }
}

export class CreateRoleDTO {
  name: string;
  userId?: string;
  groupID?: string;
  eventID?: string;
}

export class UpdateRoleDTO extends CreateRoleDTO {
  id: string;
}

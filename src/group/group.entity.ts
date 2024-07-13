export class CreateGroupDTO {
  name: string;
  roleIDs: string[];
  fatherGroupID?: string;
  eventID: string;
  thumbnailId?: string;
}

export class UpdateGroupDTO extends CreateGroupDTO {
  id: string;
}

export class CreateUserDTO {
  avatarId?: string;
  email?: string;
  password?: string;
  bannerColor?: string;
  displayName?: string;
  username: string;
  discordId?: string;
  banner?: string;
}

export class UpdateUserDTO extends CreateUserDTO {
  id: string;
}

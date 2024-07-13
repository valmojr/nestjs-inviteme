export class CreateHouseDTO {
  name: string;
  avatar?: string;
  public: boolean;
  discordId?: string;
  banner?: string;
}

export class UpdateHouseDTO extends CreateHouseDTO {
  id: string;
}

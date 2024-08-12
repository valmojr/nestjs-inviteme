export class CreateEventDTO {
  name: string;
  mainGroupID: string;
  location?: string;
  description?: string;
  endDate: Date | null;
  ownerID: string;
  startDate: Date;
  thumbnailId?: string;
  visibility: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
}

export class UpdateEventDTO extends CreateEventDTO {
  id: string;
}

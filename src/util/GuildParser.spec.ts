import GuildParser from './GuildParser';

describe('GuildParser Tests', () => {
  it('should be defined', () => {
    expect(GuildParser).toBeDefined();
  });

  it('should be able to parse a discord guild as a house', () => {
    const guild: any = {
      id: 'valid_id',
      createdAt: new Date(),
      name: 'valid_name',
      iconURL: () => 'iconURL',
      bannerURL: () => 'bannerURL',
    };

    const house = GuildParser(guild, true);

    expect(house).toBeDefined();
    expect(house.public).toBeTruthy();
  });

  it('should throw if parsed a invalid guild', async () => {
    try {
      const guild: any = {
        id: null,
        createdAt: new Date(),
        name: 'valid_name',
        iconURL: () => 'iconURL',
        bannerURL: () => 'bannerURL',
      };

      const house = GuildParser(guild, false);

      expect(GuildParser).toThrow();
      expect(house).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('invalid guild information provided');
    }
  });

  it('should be able to parse private guild if no public param is provided', () => {
    const guild: any = {
      id: 'valid_id',
      createdAt: new Date(),
      name: 'valid_name',
      iconURL: () => 'iconURL',
      bannerURL: () => 'bannerURL',
    };

    const house = GuildParser(guild);

    expect(house).toBeDefined();
    expect(house.public).toBeFalsy();
  });
});

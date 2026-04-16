export type TokenPayloadDto = {
  id: string;
  profileId: string;
  clientId: string;
  organizationId: number;
  iat?: number;
  exp?: number;
};

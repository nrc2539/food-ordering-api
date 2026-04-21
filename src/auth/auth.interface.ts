export interface JwtPayload {
  email: string;
}

export interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

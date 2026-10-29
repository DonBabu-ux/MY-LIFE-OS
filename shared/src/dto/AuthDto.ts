export interface AuthRegisterDto {
  username?: string;
  email?: string;
  deviceId: string;
  publicKey?: string;
}

export interface AuthLoginDto {
  deviceId: string;
  token?: string;
  signature?: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
  deviceId: string;
}

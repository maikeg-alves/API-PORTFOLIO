export enum TokenType {
  ACCESS = 'A',
  REFRESH = 'R',
}

export interface TokenFingerprintPair {
  token: string;
  fingerprint: string;
}

export interface RefreshPayload {
  t: TokenType.REFRESH;
  fingerprint: string;
  username: string;
}

export interface FullRefreshPayload extends RefreshPayload {
  subject: string;
}

export interface AccessPayload {
  t: TokenType.ACCESS;
  username: string;
  restricted?: boolean;
}

export interface FullAccessPayload extends AccessPayload {
  iat: Date;
  exp: Date;
  sub: string;
}

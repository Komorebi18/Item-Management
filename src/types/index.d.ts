// 腾讯云临时token
export interface ITemporaryToken {
  credentials: ICredentials
  requestId: string
  expiration: string
  startTime: number
  expiredTime: number
}

export interface ICredentials {
  tmpSecretId: string
  tmpSecretKey: string
  sessionToken: string
  token: string
}

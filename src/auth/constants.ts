// var envExpire = Number(process.env.JWT_EXPIRES_IN)
export const jwtConstants: { secret: string, expiresIn: number } = {
    secret: process.env.JWT_SECRET ?? '1234',
    expiresIn: 3000000000
}
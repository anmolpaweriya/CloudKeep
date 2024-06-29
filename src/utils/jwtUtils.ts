
import jwt from 'jsonwebtoken'


export class JWTUtils {


    static async generateAccessToken(data: any) {
        const accessTokenSecret = String(process.env.ACCESS_TOKEN_SECRET);
        const accessTokenExpiresIn = String(process.env.ACCESS_TOKEN_EXPIRES_IN)

        const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: accessTokenExpiresIn })

        return accessToken
    }

    static async generateRefreshToken(data: any) {
        const refreshTokenSecret = String(process.env.REFRESH_TOKEN_SECRET);
        const refreshTokenExpiresIn = String(process.env.REFRESH_TOKEN_EXPIRES_IN)
        const refreshToken = jwt.sign(data, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn })

        return refreshToken
    }


    static async fetchAccessTokenData(accessToken: string) {

        const data = await fetch('/api/auth/token', {
            method: 'GET',
            headers: {
                'Authentication': `Bearer ${accessToken}`
            }
        }).then(res => res.json());


        return data

    }
    static async refreshAccessToken(refreshToken: string) {
        const data = await fetch('/api/auth/token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        }).then(res => res.json());

        return data

    }

}
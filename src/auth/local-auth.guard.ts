import { AuthGuard } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard('local') {
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username }
    }
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("JWT_REFRESH_SECRET") ||
        "your-refresh-secret-key-change-in-production",
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid token type");
    }

    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not provided");
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Verify the refresh token exists in the user's stored tokens
    if (!user.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return {
      userId: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}

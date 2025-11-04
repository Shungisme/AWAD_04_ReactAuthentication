import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>("JWT_SECRET") ||
          "your-secret-key-change-in-production",
        signOptions: {
          expiresIn: "15m", // Access token expires in 15 minutes
        },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}

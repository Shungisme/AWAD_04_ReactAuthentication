import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JwtRefreshGuard } from "../auth/jwt-refresh.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Cookie configuration
  private readonly cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax" as const, // CSRF protection
    path: "/",
  };

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const result = await this.userService.login(loginUserDto);

    //  Set refreshToken as httpOnly cookie only
    res.cookie("refreshToken", result.refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //  Return accessToken in response body (to be stored in memory)
    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const tokens = await this.userService.refreshTokens(
      req.user.userId,
      req.user.refreshToken
    );

    //  Set new refreshToken as cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //  Return new accessToken in response body
    return { 
      message: "Tokens refreshed successfully",
      accessToken: tokens.accessToken
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    //  Clear cookies
    res.clearCookie("accessToken", this.cookieOptions);
    res.clearCookie("refreshToken", this.cookieOptions);

    return this.userService.logout(req.user.userId);
  }

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }
}

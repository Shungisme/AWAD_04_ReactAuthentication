import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./schemas/user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<{ message: string; user: { email: string; createdAt: Date } }> {
    const { email, password } = registerUserDto;

    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        createdAt: new Date(),
        refreshTokens: [],
      });

      const savedUser = await newUser.save();

      return {
        message: "User registered successfully",
        user: {
          email: savedUser.email,
          createdAt: savedUser.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred during registration"
      );
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(
    loginUserDto: LoginUserDto
  ): Promise<{
    message: string;
    user: { email: string };
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginUserDto;

    try {
      // Find user by email
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new UnauthorizedException("Invalid email or password");
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password");
      }

      // Generate tokens
      const tokens = await this.generateTokens(user._id.toString(), user.email);

      // Store refresh token
      await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        message: "Login successful",
        user: {
          email: user.email,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("An error occurred during login");
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string
  ): Promise<TokenResponse> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      // Verify the refresh token is in the user's stored tokens
      if (!user.refreshTokens.includes(refreshToken)) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Remove old refresh token
      await this.removeRefreshToken(userId, refreshToken);

      // Generate new tokens
      const tokens = await this.generateTokens(userId, user.email);

      // Store new refresh token
      await this.storeRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred during token refresh"
      );
    }
  }

  async logout(
    userId: string,
    refreshToken: string
  ): Promise<{ message: string }> {
    try {
      await this.removeRefreshToken(userId, refreshToken);
      return { message: "Logout successful" };
    } catch (error) {
      throw new InternalServerErrorException("An error occurred during logout");
    }
  }

  async getProfile(
    userId: string
  ): Promise<{ email: string; createdAt: Date }> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return {
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while fetching profile"
      );
    }
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          type: "access",
        },
        {
          secret:
            this.configService.get<string>("JWT_SECRET") ||
            "your-secret-key-change-in-production",
          expiresIn: "15m",
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          type: "refresh",
        },
        {
          secret:
            this.configService.get<string>("JWT_REFRESH_SECRET") ||
            "your-refresh-secret-key-change-in-production",
          expiresIn: "7d",
        }
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { refreshTokens: refreshToken } },
        { new: true }
      )
      .exec();
  }

  private async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: refreshToken } },
        { new: true }
      )
      .exec();
  }
}

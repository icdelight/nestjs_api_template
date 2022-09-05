import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthServices } from "./auth.service";
import { AuthDto } from "./dto";
import { UserDto } from "./dto";


@Controller('auth')
export class AuthController{
    constructor(private authService: AuthServices) {}

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signup(@Body() dto: UserDto) {
        console.log({dto});
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
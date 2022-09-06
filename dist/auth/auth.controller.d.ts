import { AuthServices } from "./auth.service";
import { AuthDto } from "./dto";
import { UserDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthServices);
    signup(dto: UserDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    signin(dto: AuthDto): Promise<{
        statusCode: number;
        message: string;
        tokens: {
            access_token: string;
        };
        userData: {
            id: number;
            name: string;
            role: string;
            email: string;
            fullname: string;
            id_area: number;
            id_sub_area: number;
        };
    }>;
}

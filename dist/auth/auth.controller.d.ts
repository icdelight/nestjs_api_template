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
            role: any;
            email: string;
            fullname: string;
            id_area: number;
            desc_area: any;
            id_sub_area: number;
            desc_sub_area: any;
        };
    }>;
}

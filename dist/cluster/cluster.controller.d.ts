import { ClusterServices } from './cluster.service';
import { tbl_users } from '@prisma/client';
export declare class ClusterController {
    private clusterService;
    constructor(clusterService: ClusterServices);
    GetAllCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    GetAllClusterByPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    FindClusterByPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    AddCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    EditCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}

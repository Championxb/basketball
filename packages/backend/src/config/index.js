/**
 * 配置文件
 */
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export default {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    
    // 数据库配置（未来可以添加）
    database: {
        // 数据库配置信息
    },
    
    // CORS配置
    cors: {
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    },
    
    // JWT配置（未来可以添加）
    jwt: {
        // JWT配置信息
    }
};
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import authRouter from '../routes/auth.routes';
import userRouter from '../routes/users.routes';
import companyRouter from '../routes/companies.routes';
import vacanciesRouter from "../routes/vacancies.routes";
import jobApplicationsRouter from "../routes/jobApplications.routes";
import callsRouter from "../routes/calls.routes";
import { verifyAPIKey } from '../middlewares/apiKeyAuth';

dotenv.config();

class Server {
    private app: express.Application;
    private port: string;
    private server: http.Server;
    private io: SocketIOServer;
    private authPath: string;
    private usersPath: string;
    private companiesPath: string;
    private vacanciesPath: string;
    private jobApplicationsPath: string;
    private callsPath: string;

    constructor() {
        // Use express framework
        this.app = express();
        // Main page
        this.app.use(express.static('../public/index.html'));
        // Port number (.env)
        this.port = process.env.PORT || '3000';
        // Server for sockets
        this.server = http.createServer(this.app);
        // Socket
        this.io = new SocketIOServer(this.server, {
            cors: { 
                origin: [
                    'http://localhost', 
                    'http://localhost:3000', 
                    ''
                ], 
                credentials: true 
            }
        });
        this.authPath = '/api/auth';
        this.usersPath = '/api/users';
        this.companiesPath = '/api/companies';
        this.vacanciesPath = "/api/vacancies";
        this.jobApplicationsPath = "/api/job_applications";
        this.callsPath = "/api/calls";
        
        // Middlewares
        this.middlewares();
        // App routes
        this.routes();
        // Activate sockets
        // this.sockets();
    }

    private middlewares(): void {
        // CORS
        // Se establecen los headers necesarios para contenido y autorización,
        // se establecen los únicos métodos usados en los endpoints.
        this.app.use(cors({
            allowedHeaders: ["Content-Type", "Authorization", "Api-Key"],
            methods: ["GET", "POST"],
        }));
        // Read and parse body
        this.app.use(express.json());
        // Verificación de autorización.
        this.app.use(verifyAPIKey);
        // File upload
        // Configuración básica para express-fileupload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/' // Usar /tmp en Vercel
        }));
    }
    
    private routes(): void {
        // Routes
        this.app.use(this.authPath, authRouter);
        this.app.use(this.usersPath, userRouter);
        this.app.use(this.companiesPath, companyRouter);
        this.app.use(this.vacanciesPath, vacanciesRouter);
        this.app.use(this.jobApplicationsPath, jobApplicationsRouter);
        this.app.use(this.callsPath, callsRouter);
        // this.app.use(this.adminPath, administradorRoutes);
    }

    private sockets(): void {
    //     this.io.on('connection', socketController);
    //     // this.io.on('connection', (payload) => { console.log ('conectado')});
    }

    public listen(): void {
        // Select a port for the server to listen on
        this.server.listen(this.port, () => {
            console.log('listening on port', this.port);
        });
    }
}

export default Server;
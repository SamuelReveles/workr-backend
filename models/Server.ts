import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import userRouter from '../routes/users.routes';
import companyRouter from '../routes/companies.routes';

dotenv.config();

class Server {
    private app: express.Application;
    private port: string;
    private server: http.Server;
    private io: SocketIOServer;
    private usersPath: string;
    private companiesPath: string;

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
        this.usersPath = '/api/users';
        this.companiesPath = '/api/companies';
        
        // Middlewares
        this.middlewares();
        // App routes
        this.routes();
        // Activate sockets
        // this.sockets();
    }

    private middlewares(): void {
        // CORS
        this.app.use(cors());
        // Read and parse body
        this.app.use(express.json());
        // File upload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: `${__dirname}/../file_uploads_tmp/`
        }));
    }
    
    private routes(): void {
        // Routes
        this.app.use(this.usersPath, userRouter);
        this.app.use(this.companiesPath, companyRouter);
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
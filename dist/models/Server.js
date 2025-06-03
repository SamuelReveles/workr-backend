"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const companies_routes_1 = __importDefault(require("../routes/companies.routes"));
const vacancies_routes_1 = __importDefault(require("../routes/vacancies.routes"));
const jobApplications_routes_1 = __importDefault(require("../routes/jobApplications.routes"));
const apiKeyAuth_1 = require("../middlewares/apiKeyAuth");
dotenv_1.default.config();
class Server {
    constructor() {
        // Use express framework
        this.app = (0, express_1.default)();
        // Main page
        this.app.use(express_1.default.static('../public/index.html'));
        // Port number (.env)
        this.port = process.env.PORT || '3000';
        // Server for sockets
        this.server = http_1.default.createServer(this.app);
        // Socket
        this.io = new socket_io_1.Server(this.server, {
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
        // Middlewares
        this.middlewares();
        // App routes
        this.routes();
        // Activate sockets
        // this.sockets();
    }
    middlewares() {
        // CORS
        // Se establecen los headers necesarios para contenido y autorización,
        // se establecen los únicos métodos usados en los endpoints.
        this.app.use((0, cors_1.default)({
            allowedHeaders: ["Content-Type", "Authorization", "Api-Key"],
            methods: ["GET", "POST"],
        }));
        // Read and parse body
        this.app.use(express_1.default.json());
        // Verificación de autorización.
        this.app.use(apiKeyAuth_1.verifyAPIKey);
        // File upload
        // Configuración básica para express-fileupload
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: '/tmp/' // Usar /tmp en Vercel
        }));
    }
    routes() {
        // Routes
        this.app.use(this.authPath, auth_routes_1.default);
        this.app.use(this.usersPath, users_routes_1.default);
        this.app.use(this.companiesPath, companies_routes_1.default);
        this.app.use(this.vacanciesPath, vacancies_routes_1.default);
        this.app.use(this.jobApplicationsPath, jobApplications_routes_1.default);
        // this.app.use(this.adminPath, administradorRoutes);
    }
    sockets() {
        //     this.io.on('connection', socketController);
        //     // this.io.on('connection', (payload) => { console.log ('conectado')});
    }
    listen() {
        // Select a port for the server to listen on
        this.server.listen(this.port, () => {
            console.log('listening on port', this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map
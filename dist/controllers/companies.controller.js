"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createPaymentIntent = exports.getCompanyPayInfo = exports.getProfilePicture = exports.getCompanyProfile = exports.updateCompanyProfile = exports.companyCharts = exports.registerCompany = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_API_SECRET_KEY);
/**
 * Registra una empresa tomando los datos de la solicitud.
 * @returns HTTP 201 si la empresa se registra exitosamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Company_1.default.register(req.files.profile_picture, req.body);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.registerCompany = registerCompany;
/**
 * Retorna los datos de las gráficas de las vacantes de una empresa
 * @returns HTTP 200 con un JSON que contiene los datos de las gráficas
 * HTTP 500 si ocurre un error al procesar la request.
 */
const companyCharts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchResults = yield Company_1.default.getVacancyCharts(req.companyId);
        return res.status(200).json(searchResults);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.companyCharts = companyCharts;
/**
 * Actualiza los datos de perfil de una empresa tomando los datos de la solicitud.
 * @returns HTTP 200 si la actualización se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
const updateCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Company_1.default.updateProfile(req.companyId, req.files.profile_picture, req.body);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.updateCompanyProfile = updateCompanyProfile;
/**
 * Obtiene la información del perfil correspondiente a la empresa cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Company_1.default.getProfile(req.params.companyId);
        if (profile == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).json(profile);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getCompanyProfile = getCompanyProfile;
/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getProfilePicture = (req, res) => {
    try {
        const profilePicturePath = Company_1.default.getProfilePicturePath(req.params.id);
        if (profilePicturePath == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).sendFile(profilePicturePath);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
};
exports.getProfilePicture = getProfilePicture;
/**
 * Devuelve toda la información que se ve en el "Carrito" para pagar la mensualidad por parte de una empresa.
 * @returns HTTP 200 con la información,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getCompanyPayInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyInfo = yield Company_1.default.getProfile(req.companyId);
        const companyPayInfo = yield Company_1.default.getPayInfo(req.companyId);
        return res.status(200).json(Object.assign(Object.assign({}, companyInfo), { companyPayInfo }));
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getCompanyPayInfo = getCompanyPayInfo;
/**
 * Crea un PaymentIntent de Stripe para el pago de la mensualidad de la empresa.
 * @returns HTTP 200 con el clientSecret del PaymentIntent,
 * HTTP 500 si ocurre algún error.
 */
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        const companyPayInfo = yield Company_1.default.getPayInfo(companyId);
        const amount = companyPayInfo.pricePerUser * companyPayInfo.employeesCount * 100;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'mxn',
            payment_method_types: ['card'],
            metadata: { companyId }
        });
        return res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });
    }
    catch (err) {
        console.error('Error creating payment intent:', err);
        return res.sendStatus(500);
    }
});
exports.createPaymentIntent = createPaymentIntent;
/**
 * Maneja los webhooks de Stripe para procesar eventos de pago.
 * @returns HTTP 200 si el evento se procesa correctamente,
 * HTTP 400 si la firma del webhook es inválida,
 * HTTP 500 si ocurre algún error.
 */
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const companyId = paymentIntent.metadata.companyId;
            const payment = {
                companyId,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                createdAt: new Date(event.created * 1000),
            };
            yield Company_1.default.savePayment(payment);
            console.log(`Payment saved for company ${companyId}:`, payment);
        }
        return res.status(200).json({ received: true });
    }
    catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
//# sourceMappingURL=companies.controller.js.map
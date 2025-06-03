import Company from '../models/Company';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

/**
 * Registra una empresa tomando los datos de la solicitud.
 * @returns HTTP 201 si la empresa se registra exitosamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const registerCompany = async (req, res) => {
  try {
    await Company.register(req.files.profile_picture, req.body);
    return res.sendStatus(201);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Retorna los datos de las gráficas de las vacantes de una empresa
 * @returns HTTP 200 con un JSON que contiene los datos de las gráficas
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const companyCharts = async (req, res) => {
  try {
    const searchResults = await Company.getVacancyCharts(req.companyId);
    return res.status(200).json(searchResults);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Retorna los datos de las gráficas de los trbajadores de una empresa
 * @returns HTTP 200 con un JSON que contiene los datos de las gráficas
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const employeesCharts = async (req, res) => {
  try {
    const searchResults = await Company.getWorkTimeChart(req.companyId);
    return res.status(200).json(searchResults);
  }
  catch (err) {
    console.log(err)
    return res.sendStatus(500);
  }
}

/**
 * Actualiza los datos de perfil de una empresa tomando los datos de la solicitud.
 * @returns HTTP 200 si la actualización se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
export const updateCompanyProfile = async (req, res) => {
  try {
    await Company.updateProfile(req.companyId, req.files.profile_picture, req.body);
    return res.sendStatus(200);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene la información del perfil correspondiente a la empresa cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getCompanyProfile = async (req, res) => {
  try {
    const profile = await Company.getProfile(req.params.companyId);

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
}

/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getProfilePicture = (req, res) => {
  try {
    const profilePicturePath = Company.getProfilePicturePath(req.params.id);

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
}

/**
 * Devuelve toda la información que se ve en el "Carrito" para pagar la mensualidad por parte de una empresa.
 * @returns HTTP 200 con la información,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getCompanyPayInfo = async (req, res) => {
  try {
    const companyInfo = await Company.getProfile(req.companyId);
    const companyPayInfo = await Company.getPayInfo(req.companyId);

    return res.status(200).json({
      ...companyInfo,
      companyPayInfo
    })
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Crea un PaymentIntent de Stripe para el pago de la mensualidad de la empresa.
 * @returns HTTP 200 con el clientSecret del PaymentIntent,
 * HTTP 500 si ocurre algún error.
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const companyId = req.companyId;

    const companyPayInfo = await Company.getPayInfo(companyId);
    const amount = companyPayInfo.pricePerUser * companyPayInfo.employeesCount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
      payment_method_types: ['card'],
      metadata: { companyId }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return res.sendStatus(500);
  }
};

/**
 * Maneja los webhooks de Stripe para procesar eventos de pago.
 * @returns HTTP 200 si el evento se procesa correctamente,
 * HTTP 400 si la firma del webhook es inválida,
 * HTTP 500 si ocurre algún error.
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const companyId = paymentIntent.metadata.companyId;

      const payment = {
        companyId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        createdAt: new Date(event.created * 1000),
      };

      await Company.savePayment(payment);
      console.log(`Payment saved for company ${companyId}:`, payment);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};
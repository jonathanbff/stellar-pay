const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.json());

// Armazenamento simples em memória para status de pagamentos
const paymentStatus = {};

// Endpoint para receber notificações de webhook
app.post('/webhook', (req, res) => {
    const { accountId, status, data } = req.body;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }
    paymentStatus[accountId] = { status, data };
    res.status(200).json({ received: true });
});

// Endpoint para consultar status do pagamento
app.get('/payment-status/:accountId', (req, res) => {
    const { accountId } = req.params;
    const status = paymentStatus[accountId];
    if (!status) {
        return res.status(404).json({ error: 'Status not found' });
    }
    res.json(status);
});

// POST /create-payment
app.post('/create-payment', async (req, res) => {
    const { accountId, amount } = req.body;
    if (!accountId || !amount) {
        return res.status(400).json({ error: 'accountId and amount are required' });
    }
    try {
        // 1. Pegar token JWT
        const authResponse = await axios.post('https://sandbox-api-baasic.transfero.com/auth/token', {
            client_id: process.env.TRANSFERO_CLIENT_ID,
            client_secret: process.env.TRANSFERO_CLIENT_SECRET,
            grant_type: 'client_credentials'
        });
        const token = authResponse.data.access_token;

        // 2. Criar QRCode
        const qrResponse = await axios.post(
            `https://sandbox-api-baasic.transfero.com/api/v2.0/accounts/${accountId}/depositDynamicQRCode`,
            {
                amount: amount
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const qrData = qrResponse.data;

        // 3. Registrar callback para webhook
        const webhookUrl = `${req.protocol}://${req.get('host')}/webhook`;
        await axios.post(
            `https://sandbox-api-baasic.transfero.com/callback/v2.0/subscribe/depositorders/accounts/${accountId}`,
            {
                url: webhookUrl,
                event: 'depositorder.created'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.json({ qrData, webhook: webhookUrl, statusEndpoint: `/payment-status/${accountId}` });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao criar pagamento', details: error.response?.data || error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// server.js - Backend Express server per il test dell'integrazione Telnyx
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const telnyx = require('telnyx');
const dotenv = require('dotenv');
const path = require('path');

// Carica le variabili d'ambiente
dotenv.config();

// Configura il client Telnyx con la tua API key
const telnyxClient = telnyx(process.env.TELNYX_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint per ottenere numeri disponibili
app.get('/api/available-numbers', async (req, res) => {
  try {
    const country = req.query.country || 'IT';
    const results = await telnyxClient.availablePhoneNumbers.list({
      country_code: country,
      limit: 10
    });
    
    res.json(results.data);
  } catch (error) {
    console.error('Errore nel recupero dei numeri disponibili:', error);
    res.status(500).json({ error: 'Errore nel recupero dei numeri disponibili', details: error.message });
  }
});

// Endpoint per acquistare un numero
app.post('/api/purchase-number', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Numero di telefono non fornito' });
    }
    
    // Acquista il numero
    const numberOrder = await telnyxClient.numberOrders.create({
      phone_numbers: [{ phone_number: phoneNumber }],
      connection_id: process.env.TELNYX_CONNECTION_ID // Necessario per instradare le chiamate
    });
    
    res.json({ success: true, order: numberOrder.data });
  } catch (error) {
    console.error('Errore nell\'acquisto del numero:', error);
    res.status(500).json({ error: 'Errore nell\'acquisto del numero', details: error.message });
  }
});

// Endpoint per configurare l'inoltro delle chiamate
app.post('/api/setup-call-forwarding', async (req, res) => {
  try {
    const { phoneNumber, forwardToNumber } = req.body;
    
    if (!phoneNumber || !forwardToNumber) {
      return res.status(400).json({ error: 'Numero di telefono o numero di destinazione mancante' });
    }
    
    // Configura l'inoltro delle chiamate tramite messaging profile
    const messagingProfile = await telnyxClient.messagingProfiles.create({
      name: `Call Forwarding for ${phoneNumber}`,
      enabled: true,
      webhook_url: `${process.env.APP_URL}/api/call-webhook`
    });
    
    // Associa il numero al profilo di messaggistica
    await telnyxClient.phoneNumbers.update(phoneNumber, {
      messaging_profile_id: messagingProfile.data.id,
      connection_id: process.env.TELNYX_CONNECTION_ID
    });
    
    // Salva l'associazione tra numero e destinazione
    // In una versione di produzione, salveresti questo in un database
    // Per ora, simuliamo solo una risposta di successo
    
    res.json({
      success: true,
      phoneNumber,
      forwardTo: forwardToNumber,
      profileId: messagingProfile.data.id
    });
  } catch (error) {
    console.error('Errore nella configurazione dell\'inoltro:', error);
    res.status(500).json({ error: 'Errore nella configurazione dell\'inoltro', details: error.message });
  }
});

// Webhook per gestire le chiamate in entrata
app.post('/api/call-webhook', (req, res) => {
  try {
    const event = req.body;
    console.log('Chiamata in entrata:', event);
    
    // Gestione degli eventi di chiamata
    if (event.data && event.data.event_type === 'call.initiated') {
      // Recupera il numero a cui inoltrare la chiamata
      // In produzione, questo verrebbe recuperato dal database
      const forwardToNumber = '...'; // simulato
      
      // Invia comando per inoltrare la chiamata
      const callControlId = event.data.payload.call_control_id;
      telnyxClient.calls.transfer({
        call_control_id: callControlId,
        to: forwardToNumber
      });
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Errore nella gestione del webhook:', error);
    res.sendStatus(200); // Rispondi sempre 200 ai webhook, anche in caso di errore
  }
});

// Rotta principale per servire l'interfaccia
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

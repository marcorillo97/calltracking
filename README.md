# Call Tracking Test App

Questa è una semplice applicazione di test per creare un servizio di call tracking utilizzando l'API di Telnyx. L'applicazione permette di:

1. Cercare numeri di telefono disponibili in diversi paesi
2. Acquistare un numero di telefono
3. Configurare l'inoltro delle chiamate a un altro numero
4. Testare che le chiamate vengano inoltrate correttamente

## Requisiti

- Node.js v14+ installato
- Un account Telnyx con credito disponibile
- Accesso al pannello Mission Control di Telnyx per configurare connessioni e webhook

## Configurazione iniziale

### 1. Configurazione su Telnyx

Prima di eseguire l'applicazione, è necessario configurare alcune cose sul pannello di controllo di Telnyx:

1. **Registra un account Telnyx** se non ne hai già uno su [telnyx.com](https://telnyx.com)
2. **Ottieni una chiave API**:
   - Vai su Mission Control > Auth > API Keys
   - Crea una nuova chiave API o usa una esistente
3. **Crea una Connessione per le chiamate**:
   - Vai su Voice > Call Control
   - Crea una nuova connessione SIP
   - Prendi nota del Connection ID

### 2. Configurazione dell'applicazione

1. Clona questa repository
2. Installa le dipendenze:
   ```
   npm install
   ```
3. Copia il file `.env.example` in `.env`:
   ```
   cp .env.example .env
   ```
4. Modifica il file `.env` inserendo:
   - La tua chiave API Telnyx (`TELNYX_API_KEY`)
   - Il tuo Connection ID (`TELNYX_CONNECTION_ID`)
   - L'URL pubblico dell'applicazione per i webhook (`APP_URL`)

### 3. Esposizione dell'applicazione per i webhook

Per ricevere gli eventi dalle chiamate in entrata, Telnyx deve poter inviare webhook al tuo server. In ambiente di sviluppo, puoi usare [ngrok](https://ngrok.com) per creare un tunnel:

```
ngrok http 3000
```

Prendi nota dell'URL generato (es. `https://abc123.ngrok.io`) e inseriscilo nel file `.env` come `APP_URL`.

## Avvio dell'applicazione

Avvia il server con:

```
npm start
```

L'applicazione sarà disponibile all'indirizzo [http://localhost:3000](http://localhost:3000).

## Flusso d'uso dell'applicazione

1. **Cerca numeri disponibili**:
   - Seleziona un paese dall'elenco a discesa
   - Clicca su "Cerca numeri disponibili"
   - Seleziona un numero dall'elenco visualizzato

2. **Acquista il numero**:
   - Clicca su "Acquista numero"
   - Attendi la conferma dell'acquisto

3. **Configura l'inoltro**:
   - Inserisci il numero di destinazione (con prefisso internazionale, es. +393401234567)
   - Clicca su "Configura inoltro"
   - Attendi la conferma della configurazione

4. **Test**:
   - Una volta completata la configurazione, chiama il numero acquistato
   - La chiamata dovrebbe essere inoltrata al numero di destinazione configurato

## Struttura del progetto

- `server.js`: Backend Express.js che gestisce le richieste API e i webhook
- `public/index.html`: Frontend che fornisce l'interfaccia utente
- `.env`: File di configurazione per le variabili d'ambiente

## Limitazioni della versione di test

Questa versione di test presenta alcune limitazioni:

- Non c'è persistenza dei dati (nessun database)
- Non c'è gestione degli utenti o autenticazione
- Le informazioni vengono perse al riavvio del server
- Funzionalità di analisi delle chiamate non implementate
- Nessuna gestione della fatturazione o pagamenti

## Prossimi passi per una versione completa

1. Aggiungere un database (MongoDB, PostgreSQL)
2. Implementare l'autenticazione utente
3. Creare un pannello di controllo per ogni utente
4. Aggiungere tracciamento e analisi delle chiamate
5. Implementare sistema di fatturazione e pagamenti
6. Aggiungere funzionalità di reportistica
7. Implementare numeri multipli per utente
8. Aggiungere registrazione chiamate (opzionale)

## Risorse utili

- [Documentazione API Telnyx](https://developers.telnyx.com/docs/api)
- [Guida ai webhook Telnyx](https://developers.telnyx.com/docs/v2/call-control/receiving-webhooks)
- [Libreria Node.js di Telnyx](https://github.com/team-telnyx/telnyx-node)

## Supporto

Per supporto tecnico o domande, contattare l'autore dell'applicazione.

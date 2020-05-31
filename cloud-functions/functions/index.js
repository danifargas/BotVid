const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const firebase = require("firebase");
const uuid = require("uuid").v4;
const speech = require("@google-cloud/speech");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://botvid-48dc1.firebaseio.com",
});

const { SessionsClient } = require("dialogflow");

exports.textMessage = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // Get user uid and message
    const { queryInput, sessionId } = request.body;

    // Connect to DialogFlow
    const sessionClient = new SessionsClient({ credentials: serviceAccount });
    const session = sessionClient.sessionPath("botvid-48dc1", sessionId);

    // Get response from intent
    const responses = await sessionClient.detectIntent({ session, queryInput });

    const result = responses[0].queryResult;

    // Save response to DB
    const db = admin.firestore();
    const collection = db.collection(`users/${sessionId}/messages`);

    const messages = [
      {
        $key: uuid(),
        message: queryInput.text.text,
        datetime: Date.now(),
        isBot: false,
      },
    ];

    for (let i = 0; i < result.fulfillmentMessages.length; i++) {
      messages.push({
        $key: uuid(),
        message: result.fulfillmentMessages[i].text.text,
        datetime: Date.now() + 1 + i,
        isBot: true,
      });
    }

    for (let i = 0; i < messages.length; i++) {
      await collection.add(messages[i]);
    }

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Credentials", true);
    response.set(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Content-Type", "application/json");
    response.send(result);
  });
});

exports.audioMessage = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // Get user uid and message
    const { audioBytes, sessionId } = request.body;

    // Get transcripted message
    const client = new speech.SpeechClient();

    const req = {
      audio: {
        content: audioBytes,
      },
      config: {
        languageCode: "es-ES",
      },
    };

    const [res] = await client.recognize(req);
    const transcription = res.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    // Connect to DialogFlow
    const sessionClient = new SessionsClient({ credentials: serviceAccount });
    const session = sessionClient.sessionPath("botvid-48dc1", sessionId);

    // Get response from intent
    const responses = await sessionClient.detectIntent({
      session,
      queryInput: { text: { text: transcription, languageCode: "es-ES" } },
    });

    const result = responses[0].queryResult;

    // Save response to DB
    const db = admin.firestore();
    const collection = db.collection(`users/${sessionId}/messages`);

    const messages = [
      {
        $key: uuid(),
        message: transcription,
        datetime: Date.now(),
        isBot: false,
      },
    ];

    for (let i = 0; i < result.fulfillmentMessages.length; i++) {
      messages.push({
        $key: uuid(),
        message: result.fulfillmentMessages[i].text.text,
        datetime: Date.now(),
        isBot: true,
      });
    }

    for (let i = 0; i < messages.length; i++) {
      await collection.add(messages[i]);
    }

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Credentials", true);
    response.set(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Content-Type", "application/json");
    response.send(transcription);
  });
});

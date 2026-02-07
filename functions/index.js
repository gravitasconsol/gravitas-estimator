const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Get PayMongo key from environment variable (NOT hardcoded)
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

const https = require('https');

// Helper function to make PayMongo API calls
function makePayMongoRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    if (!PAYMONGO_SECRET_KEY) {
      reject(new Error('PayMongo secret key not configured'));
      return;
    }
    
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.paymongo.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(parsedData.errors?.[0]?.detail || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

exports.createSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please sign in first');
  }

  const { tier, userId } = data;
  if (!tier || !userId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing parameters');
  }
  
  const amount = tier === 'standard' ? 49900 : 149900;

  try {
    const paymongoData = {
      data: {
        attributes: {
          amount: amount,
          currency: 'PHP',
          description: `Gravitas ${tier} Subscription`,
          payment_method_allowed: ['card', 'gcash', 'grab_pay', 'paymaya'],
          metadata: { userId, tier, email: context.auth.token.email || '' }
        }
      }
    };

    const result = await makePayMongoRequest('/v1/payment_intents', 'POST', paymongoData);
    
    await db.collection('subscriptions').add({
      userId: userId,
      tier: tier,
      paymongoPaymentIntentId: result.data.id,
      status: 'pending',
      amount: amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      clientKey: result.data.attributes.client_key,
      paymentIntentId: result.data.id
    };
    
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.paymongoWebhook = functions.https.onRequest(async (req, res) => {
  const event = req.body;
  
  if (event.data?.attributes?.type === 'payment.paid') {
    const paymentIntentId = event.data.attributes.data.id;
    
    try {
      const subsSnapshot = await db
        .collection('subscriptions')
        .where('paymongoPaymentIntentId', '==', paymentIntentId)
        .get();
      
      if (!subsSnapshot.empty) {
        const subDoc = subsSnapshot.docs[0];
        const subData = subDoc.data();
        
        await subDoc.ref.update({
          status: 'active',
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        await db.doc(`users/${subData.userId}`).update({
          tier: subData.tier,
          tierStatus: 'active',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      res.status(200).send('OK');
    } catch (error) {
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('Ignored');
  }
});
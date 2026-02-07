const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Your PayMongo Secret Key
const PAYMONGO_SECRET_KEY = 'sk_live_XWExG5QTdYSqsqMdsRJL6nFB';

// Use native https module instead of fetch
const https = require('https');

// Helper function to make PayMongo API calls
function makePayMongoRequest(path, method, data) {
  return new Promise((resolve, reject) => {
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

      res.on('data', (chunk) => {
        responseData += chunk;
      });

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

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Create subscription (called from your app)
exports.createSubscription = functions.https.onCall(async (data, context) => {
  console.log('createSubscription called:', JSON.stringify(data));
  
  // Check if user is logged in
  if (!context.auth) {
    console.error('No auth context');
    throw new functions.https.HttpsError('unauthenticated', 'Please sign in first');
  }

  const { tier, userId } = data;
  
  if (!tier || !userId) {
    console.error('Missing tier or userId');
    throw new functions.https.HttpsError('invalid-argument', 'Missing tier or userId');
  }
  
  const amount = tier === 'standard' ? 49900 : 149900; // in centavos
  
  console.log(`Creating ${tier} subscription, amount: ${amount}`);

  try {
    // Create PayMongo payment intent
    const paymongoData = {
      data: {
        attributes: {
          amount: amount,
          currency: 'PHP',
          description: `Gravitas ${tier} Subscription`,
          payment_method_allowed: ['card', 'gcash', 'grab_pay', 'paymaya'],
          metadata: { 
            userId: userId, 
            tier: tier,
            email: context.auth.token.email || ''
          }
        }
      }
    };

    const result = await makePayMongoRequest('/v1/payment_intents', 'POST', paymongoData);
    console.log('PayMongo success:', result.data.id);
    
    // Save to Firestore
    const subscriptionRef = await db.collection('subscriptions').add({
      userId: userId,
      tier: tier,
      paymongoPaymentIntentId: result.data.id,
      status: 'pending',
      amount: amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Subscription saved:', subscriptionRef.id);
    
    return {
      clientSecret: result.data.attributes.client_key,
      paymentIntentId: result.data.id,
      subscriptionId: subscriptionRef.id
    };
    
  } catch (error) {
    console.error('Payment error:', error.message);
    throw new functions.https.HttpsError('internal', error.message || 'Payment creation failed');
  }
});

// PayMongo webhook
exports.paymongoWebhook = functions.https.onRequest(async (req, res) => {
  console.log('Webhook received');
  
  const event = req.body;
  
  if (event.data?.attributes?.type === 'payment.paid') {
    const paymentIntentId = event.data.attributes.data.id;
    console.log('Payment succeeded:', paymentIntentId);
    
    try {
      const subsSnapshot = await db
        .collection('subscriptions')
        .where('paymongoPaymentIntentId', '==', paymentIntentId)
        .get();
      
      if (subsSnapshot.empty) {
        console.error('Subscription not found');
        res.status(200).send('OK');
        return;
      }
      
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
      
      console.log('User upgraded to:', subData.tier);
      res.status(200).send('OK');
      
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('Ignored');
  }
});

// Test function
exports.helloWorld = functions.https.onCall((data, context) => {
  return { 
    message: 'Hello from Firebase!',
    uid: context.auth?.uid || 'not logged in'
  };
});
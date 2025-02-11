import { NextResponse } from 'next/server';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: ['read_orders', 'read_products'],
  hostName: process.env.SHOPIFY_SHOP_NAME || '',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    // Create a new client session
    const client = new shopify.clients.Rest({
      session: {
        shop: process.env.SHOPIFY_SHOP_NAME || '',
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
      },
    });

    // Query orders by phone number
    const response = await client.get({
      path: 'orders',
      query: {
        phone: phoneNumber,
        status: 'any',
      },
    });

    return NextResponse.json({ orders: response.body.orders });
  } catch (error) {
    console.error('Shopify API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
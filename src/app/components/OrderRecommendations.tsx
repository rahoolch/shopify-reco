'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  line_items: Array<{
    id: string;
    title: string;
    quantity: number;
    product_type?: string;
  }>;
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

const OrderRecommendations: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string): string => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.replace(/\D/g, '') }),
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data.orders);
      
      generateRecommendations(data.orders);
    } catch (err) {
      setError('Unable to fetch your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (orderHistory: Order[]) => {
    const purchasedCategories = new Set<string>();
    orderHistory.forEach(order => {
      order.line_items.forEach(item => {
        if (item.product_type) {
          purchasedCategories.add(item.product_type);
        }
      });
    });

    // Placeholder recommendations
    setRecommendations([
      {
        id: 1,
        name: 'New Product 1',
        price: '$29.99',
        category: 'Category A',
        image: '/api/placeholder/200/200'
      },
      {
        id: 2,
        name: 'New Product 2',
        price: '$39.99',
        category: 'Category B',
        image: '/api/placeholder/200/200'
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Order History & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              type="tel"
              placeholder="(555) 555-5555"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="max-w-xs"
            />
            <Button 
              onClick={fetchOrders}
              disabled={loading || phoneNumber.length < 14}
            >
              {loading ? 'Loading...' : 'Find Orders'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {orders.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Past Orders</h3>
                <div className="grid gap-4">
                  {orders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <p className="font-medium">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                          {order.line_items.map(item => (
                            <div key={item.id} className="text-sm">
                              {item.title} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map(product => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover mb-4 rounded"
                        />
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="font-semibold mt-2">{product.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderRecommendations;
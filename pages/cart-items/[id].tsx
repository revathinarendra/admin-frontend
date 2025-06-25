// pages/cart-items/[id].tsx
import API from '@/utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function CartItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [cartItem, setCartItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      API.get(`/cart-items/${id}/`).then(res => setCartItem(res.data));
    }
  }, [id]);

  if (!cartItem) return <p>Loading...</p>;

  return (
    <div>
      <h2>Cart Item Detail</h2>
      <p>Item: {cartItem.item?.title}</p>
      <p>Quantity: {cartItem.quantity}</p>
    </div>
  );
}

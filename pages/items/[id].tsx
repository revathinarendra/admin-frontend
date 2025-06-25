// pages/items/[id].tsx
import API from '@/utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function ItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      API.get(`/items/${id}/`).then(res => setItem(res.data));
    }
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
    </div>
  );
}

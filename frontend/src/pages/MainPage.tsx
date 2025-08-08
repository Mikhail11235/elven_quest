import { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import WishListSection from '../components/WishListSection';
import PlaceInfoSection from '../components/PlaceInfoSection';
import DressCodeSection from '../components/DressCodeSection';
import { TabKey, Gift } from '../types';

export default function MainPage() {
  const [tab, setTab] = useState<TabKey>('wishlist');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [placeInfo, setPlaceInfo] = useState('');
  const [dressCodeInfo, setDressCodeInfo] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/get_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': token
        },
      });

      if (!response.ok) throw new Error('Ошибка загрузки данных');

      const data = await response.json();
      setGifts(data.gifts);
      setPlaceInfo(data.place_info);
      setDressCodeInfo(data.dress_code_info);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGiftUpdate = (updatedGifts: Gift[]) => {
    setGifts(updatedGifts);
  };

  return (
    <div className="app" style={{ transition: 'opacity 0.5s ease-in-out' }}>
      <img src="/assets/logo.svg" alt="Magic File Logo" className="logo" />
      <Tabs activeTab={tab} onTabChange={setTab} />
      <div className={`section ${tab === 'wishlist' ? 'active' : ''}`}>
        <WishListSection gifts={gifts} onGiftUpdate={handleGiftUpdate} />
      </div>
      <div className={`section ${tab === 'place' ? 'active' : ''}`}>
        <PlaceInfoSection placeInfo={placeInfo} />
      </div>
      <div className={`section ${tab === 'dress' ? 'active' : ''}`}>
        <DressCodeSection dressCodeInfo={dressCodeInfo} />
      </div>
    </div>
  );
}
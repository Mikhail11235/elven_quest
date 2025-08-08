import { useState } from 'react';
import Modal from './Modal';
import { Gift } from '../types';

type WishListProps = {
  gifts: Gift[];
  onGiftUpdate: (updatedGifts: Gift[]) => void;
};

export default function WishListSection({ gifts, onGiftUpdate }: WishListProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [conflictError, setConflictError] = useState<boolean>(false);

  const handleSelectGift = (gift: Gift) => {
    setSelectedGift(gift);
    setConflictError(false);
  };

  const confirmReservation = async () => {
    if (!selectedGift) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = selectedGift.reserved ? 'unreserve' : 'reserve';
      const response = await fetch(
        `/api/gifts/${selectedGift.id}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ACCESS-TOKEN': token
          },
        }
      );

      if (response.ok) {
        const updatedGifts = gifts.map(gift =>
          gift.id === selectedGift.id
            ? { ...gift, reserved: !gift.reserved }
            : gift
        );
        onGiftUpdate(updatedGifts);
      } else if (response.status === 409) {
        setConflictError(true);
        return;
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      if (!conflictError) {
        setSelectedGift(null);
      }
    }
  };

  const handleConflictConfirm = () => {
    window.location.reload();
  };

  const cancelReservation = () => {
    setSelectedGift(null);
    setConflictError(false);
  };

  return (
    <div className="wishlist">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={`gift-card ${gift.reserved ? 'gift-disabled' : ''}`}
        >
          <div className={`gift-img-container grade_${gift.grade}`}>
            <div className='glow'></div>
            <img src={gift.image} alt={gift.name} />
          </div>
          <div className="gift-info">
            <p className="gift-name">{gift.name}</p>
            {gift.details && <p className='gift-details'>{gift.details}</p>}
            {gift.link && (
              <a href={gift.link} target="_blank" className="gift-link">
                {gift.link}
              </a>
            )}
          </div>
          <div
            className="gift-checkbox"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectGift(gift);
            }}
          >
            {gift.reserved && <div className="gift-checkbox-mark"></div>}
          </div>
        </div>
      ))}

      {selectedGift && !conflictError && (
        <Modal
          selectedGift={selectedGift}
          onConfirmReservation={confirmReservation}
          onCancelReservation={cancelReservation}
        />
      )}

      {conflictError && (
        <Modal
          selectedGift={selectedGift}
          message="Кто-то другой уже изменил статус этого подарка"
          confirmText="ОК"
          onConfirmReservation={handleConflictConfirm}
          showCancel={false}
        />
      )}
    </div>
  );
}
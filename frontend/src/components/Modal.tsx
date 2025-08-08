import { Gift } from '../types'

type ModalProps = {
  selectedGift: Gift;
  message?: string;
  onConfirmReservation: () => void;
  onCancelReservation?: () => void;
  confirmText?: string;
  showCancel?: boolean;
};

export default function Modal({
  selectedGift,
  message,
  onConfirmReservation,
  onCancelReservation,
  confirmText = 'Да',
  showCancel = true,
}: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>
          {message || (selectedGift.reserved
            ? 'Вы уверены, что хотите снять бронь с этого предмета?'
            : 'Вы уверены, что хотите выбрать этот предмет?')}
        </p>
        <div className="modal-buttons">
          <div className="modal-button" onClick={onConfirmReservation}>
            {confirmText}
          </div>
          {showCancel && (
            <div className="modal-button" onClick={onCancelReservation}>
              Нет
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
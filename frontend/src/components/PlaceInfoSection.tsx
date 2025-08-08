import { sanitizeHtml } from '../utils';

type PlaceInfoSectionProps = {
  placeInfo: string;
};

export default function PlaceInfoSection({ placeInfo }: PlaceInfoSectionProps) {
  return (
    <div className="place">
      <div className='place-content' dangerouslySetInnerHTML={{ __html: sanitizeHtml(placeInfo) }}>
      </div>
    </div>
  );
}
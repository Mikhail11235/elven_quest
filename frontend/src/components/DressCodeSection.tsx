import { sanitizeHtml } from '../utils'

type DressCodeSectionProps = {
  dressCodeInfo: string;
};

export default function DressCodeSection({ dressCodeInfo }: DressCodeSectionProps) {
  return (
    <div className="dress">
      <div className="dress-content">
        <div
          className="dress-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(dressCodeInfo) }}
        />
      </div>
    </div>
  );
}
import { TabKey } from '../types';

type TabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const tabOrder: TabKey[] = ['wishlist', 'place', 'dress'];

  const getZIndex = (key: TabKey): number => {
    const index = tabOrder.indexOf(key);
    const activeIndex = tabOrder.indexOf(activeTab);
    return index === activeIndex ? 4 : 3 - Math.abs(index - activeIndex);
  };

  return (
    <div className="tabs">
      {tabOrder.map((key) => (
        <div
          key={key}
          className={`tab ${activeTab === key ? 'active' : ''}`}
          style={{ zIndex: getZIndex(key) }}
          onClick={() => onTabChange(key)}
        >
          {key === 'wishlist' && 'вишлист'}
          {key === 'place' && 'место и время'}
          {key === 'dress' && 'дресс-код'}
        </div>
      ))}
    </div>
  );
}
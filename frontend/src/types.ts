export type Gift = {
  id: number;
  name: string;
  details: string;
  link?: string;
  image?: string;
  reserved: boolean;
  grade: string;
};

export type TabKey = 'wishlist' | 'place' | 'dress';

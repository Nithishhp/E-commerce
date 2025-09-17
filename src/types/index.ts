export interface Plant {
  id: string;
  name: string;
  image: string;
  price: string;
  description?: string;
  category: string;
  season: string;
  availability: boolean;
  rating: number;
  reviews: number;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CartItem extends Plant {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Season {
  id: string;
  name: string;
} 
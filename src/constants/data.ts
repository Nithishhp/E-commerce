import { Plant, Benefit } from '@/types';
import Image, { StaticImageData } from "next/image";
import tomatoImg from "../Images/tomato.jpg";
import Brinjal from "../Images/Brinjal.jpg";
import Chili from "../Images/Chilli.jpg";
import carrot from "../Images/carrots.avif";
import Spinach from "../Images/Spinach.avif";
import beetroot from "../Images/beetroot.jpg";
import cucumber from "../Images/cucumber.avif";
import lettuce from "../Images/lettuce.avif";

interface LocalPlant {
  id: string;
  name: string;
  image: string | StaticImageData;
  price: string;
  description?: string;
  category: string;
  season: string;
  availability: boolean;
  rating: number;
  reviews: number;
}


export const CATEGORIES = [
  { id: 'leafy', name: 'Leafy Vegetables' },
  { id: 'root', name: 'Root Vegetables' },
  { id: 'climbers', name: 'Climbers' },
  { id: 'fruits', name: 'Fruits' },
];

export const SEASONS = [
  { id: 'summer', name: 'Summer' },
  { id: 'winter', name: 'Winter' },
  { id: 'all', name: 'All Season' },
];

export const PLANTS: LocalPlant[] = [
  {
    id: '1',
    name: "Tomato",
    image: tomatoImg,
    price: "₹99",
    description: "High-yield tomato plant perfect for home gardens",
    category: "climbers",
    season: "summer",
    availability: true,
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2',
    name: "Brinjal",
    image: Brinjal,
    price: "₹89",
    description: "Organic brinjal sapling with disease resistance",
    category: "climbers",
    season: "summer",
    availability: true,
    rating: 4.2,
    reviews: 85
  },
  {
    id: '3',
    name: "Chili",
    image: Chili,
    price: "₹79",
    description: "Spicy chili plant with high yield potential",
    category: "climbers",
    season: "summer",
    availability: true,
    rating: 4.0,
    reviews: 95
  },
  {
    id: '4',
    name: "Spinach",
    image: Spinach,
    price: "₹69",
    description: "Nutrient-rich spinach plant",
    category: "leafy",
    season: "winter",
    availability: true,
    rating: 4.3,
    reviews: 75
  },
  {
    id: '5',
    name: "Carrot",
    image: carrot,
    price: "₹89",
    description: "Sweet and crunchy carrot variety",
    category: "root",
    season: "winter",
    availability: true,
    rating: 4.4,
    reviews: 110
  }
];

export const BENEFITS: Benefit[] = [
  {
    id: '1',
    title: "Fresh & Organic",
    description: "Grow your own pesticide-free vegetables and enjoy the freshest produce right from your garden.",
    icon: "🌱"
  },
  {
    id: '2',
    title: "Cost Effective",
    description: "Save money on groceries by growing your own vegetables at home.",
    icon: "💰"
  },
  {
    id: '3',
    title: "Therapeutic",
    description: "Gardening is a great stress reliever and provides a sense of accomplishment.",
    icon: "🧘"
  }
]; 
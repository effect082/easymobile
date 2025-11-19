export type PageType = 'newsletter' | 'promotion' | 'invitation';

export type BlockType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'gallery'
  | 'schedule' 
  | 'link' 
  | 'business' 
  | 'form' 
  | 'map' 
  | 'social';

export interface BlockStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
}

export interface BlockData {
  id: string;
  type: BlockType;
  content: any;
  style: BlockStyle;
}

export interface PageData {
  id: string;
  type: PageType;
  title: string;
  description?: string;
  password?: string; // 4 digit pin
  blocks: BlockData[];
  theme: {
    backgroundColor: string;
    fontFamily: string;
    primaryColor: string;
  };
  createdAt: number;
}

// Specific Content Types
export interface TextContent {
  text: string;
}

export interface ImageContent {
  url: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export interface VideoContent {
  url: string;
}

export interface GalleryContent {
  images: { url: string; caption?: string }[];
}

export interface ScheduleContent {
  eventName: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface BusinessContent {
  items: { label: string; value: string }[];
}

export interface FormContent {
  fields: { id: string; label: string; type: 'text' | 'email' | 'tel' | 'checkbox'; required: boolean }[];
  submitButtonText: string;
}

export interface LinkContent {
  url: string;
  label: string;
  style: 'button' | 'link';
}

export interface MapContent {
  address: string;
  lat?: number; // simplified for demo
  lng?: number;
  placeName: string;
}

export interface SocialContent {
  links: { platform: 'instagram' | 'youtube' | 'facebook' | 'blog'; url: string }[];
}
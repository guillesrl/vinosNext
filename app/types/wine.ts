export type WineType = 'Tinto' | 'Blanco' | 'Rosado' | 'Espumoso' | 'Generoso' | 'Dulce';

export type Region = {
  id: string;
  name: string;
  country: string;
};

export type Winery = {
  id: string;
  name: string;
  region: Region;
  website?: string;
};

export type GrapeVariety = {
  id: string;
  name: string;
  description?: string;
};

export type WineTasting = {
  appearance: string;
  nose: string;
  palate: string;
  conclusion: string;
};

export interface Wine {
  id?: string;
  title?: string;
  name?: string;
  vintage?: number;
  country?: string;
  county?: string;
  designation?: string;
  points?: number;
  price?: number;
  province?: string;
  variety?: string;
  winery?: string;
}

export type WineCreateInput = Partial<Wine>;
export type WineUpdateInput = Partial<WineCreateInput>;

export interface WineFilter {
  variety?: string;
  winery?: string;
  minPrice?: number;
  maxPrice?: number;
  vintage?: number;
  minPoints?: number;
}

export interface WineSortOptions {
  field: keyof Wine;
  direction: 'asc' | 'desc';
} 
// marvel.models.ts

export interface MarvelApiResponse {
  data: MarvelDataContainer;
}

export interface MarvelDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Character[];
}

export interface Character {
  id: number;
  name: string;
  description: string;
  modified: string; 
  thumbnail: Image;
  resourceURI: string;
  comics: ComicList;
  series: SeriesList;
  stories: StoryList;
  events: EventList;
}

export interface Image {
  path: string;
  extension: string;
}

export interface ComicList {
  available: number;
  collectionURI: string;
  items: ComicSummary[];
}

export interface ComicSummary {
  resourceURI: string;
  name: string;
}

export interface SeriesList {
  available: number;
  collectionURI: string;
  items: SeriesSummary[];
}

export interface SeriesSummary {
  resourceURI: string;
  name: string;
}

export interface StoryList {
  available: number;
  collectionURI: string;
  items: StorySummary[];
}

export interface StorySummary {
  resourceURI: string;
  name: string;
  type: string;
}

export interface EventList {
  available: number;
  collectionURI: string;
  items: EventSummary[];
}

export interface EventSummary {
  resourceURI: string;
  name: string;
}

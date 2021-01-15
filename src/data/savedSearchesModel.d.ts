export interface SavedQuery {
  query: string;
  name: string;
  $type: string;
}

export interface SavedSearches {
  savedQueries: SavedQuery[];
  login: string;
  $type: string;
}

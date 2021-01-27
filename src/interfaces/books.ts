export interface GoogleBooksBook {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    industryIdentifiers?: {
      id: string;
      identifier: string;
      type: string;
    }[];
  };
}

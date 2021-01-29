import { BookAttributes } from '../models/book';

export interface BookListRenderObject extends BookAttributes {
  subtitleField?: string;
  bookcoverPath?: string;
  classes?: string;
  subtitle?: string;
}

export interface BookByAuthorRenderObject extends GoogleBooksItem {
  hasBeenRead?: boolean;
  dateReadString?: string;
  isbn?: string;
}

export interface BookFormCategoryBadge {
  [id: number]: {
    name: string;
    color: string;
  };
}

export interface BookFormRenderObject extends BookAttributes {
  bookcoverPath?: string;
  dateStartedString?: string;
  dateReadString?: string;
  tagArray?: string[];
  categoryBadges?: BookFormCategoryBadge;
  ratingClasses?: string[];
}

export interface SavedBookCover {
  fileName: string;
  filePath: string;
}

export interface GoogleBooksBook {
  kind: string;
  totalItems: number;
  items: GoogleBooksItem[];
}

export interface GoogleBooksItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    industryIdentifiers: {
      id: string;
      identifier: string;
      type: string;
    }[];
    readinginModes: {
      text: boolean;
      image: boolean;
    };
    pageCount: number;
    printType: string;
    categories: string[];
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
    buyLink: string;
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
      downloadLink: string;
    };
    pdf: {
      isAvailable: boolean;
      downloadLink: string;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: false;
  };
  searchInfo: {
    textSnippet: string;
  };
}

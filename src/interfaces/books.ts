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

export interface BookFormats {
  paperback: string;
  hardback: string;
  ebook: string;
  audiobook: string;
  other: string;
}

const bookFormats: BookFormats = {
  paperback: 'Paperback',
  hardback: 'Hardback',
  ebook: 'E-Book',
  audiobook: 'Audiobook',
  other: 'Other',
};

export default bookFormats;

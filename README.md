# Book Journal

A digital book journal.

## Release Notes

### 0.3.0
- Mac Sandboxing
- Change location of the database and bookcovers
  - Mac: `~/Library/Application Support/BookJournal`
  - Linux: leave at `~/.bookjournal`
  - Windows: `C:\Users\{User}\AppData\Roaming\Alex Seifert\BookJournal`
- Add database migration strategy for seemless schema updates
- Reading statistics
- "Future Reading" -> "Not Read Yet"

### 0.2.0
- Improve initial loading time
- Preferences: light/dark theme, automatically fetch book information from Google Books (on/off), update automatically (on/off)
- Search
- Sort books by field in the book form

### 0.1.0
- Add books
- Organize them in categories
- Update mechanism
- Dark and light themes
- Automatically fetch book information based on the ISBN - https://developers.google.com/books/docs/v1/using


## Roadmap

### 0.4.0
- Print a book
- Export book as PDF
- Popup with other works by an author
  - Indication of read or not read
  - Links to Amazon (Affiliates) with the Amazon country being settable in the preferences
  - Checkbox in preferences to turn it on or off
- Fix Windows-specific bugs

### 0.5.0
- Link books (relates to, is translation of, etc)
- Webcam-scanning of bar codes
- Multiple languages (initially English, German, French, Spanish)
- Find new source for high-resolution book covers

### 1.0
- Apple and Microsoft certificates
- Update to Electron 3
- Auto-update with Squirrel
- Mac App Store version

### 1.1
- MacBook Touchbar
- Expand reading statistics (see [Notes.md](Notes.md))

### Future Ideas
- Create custom filters
- Synching of database via cloud service of choice

## Icons

From https://glyph.smarticons.co and https://material.io/tools/icons/?style=sharp

---

Alex Seifert - https://www.alexseifert.com

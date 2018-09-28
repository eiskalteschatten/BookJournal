# Book Journal

A digital book journal.

## Release Notes

### 0.4.0
- If NODE_ENV exists and === 'development', use developer DB
- Fix crash when changing book colors (change color, then change again using the same color inspector window)
- Fix bug where bookcovers are not automatically added after fetching book info from Google Books
- Fix bug where 16/09/1887 is sometimes shown in the date started field
- Sort books by date added and date updated
- Popup with other works by an author
  - Indication of read or not read
  - Links to Amazon (Affiliates) with the Amazon country being settable in the preferences
  - Checkbox in preferences to turn it on or off
- Fix Windows-specific bugs

### 0.3.0
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

### 0.5.0
- Print a book
- Export book as PDF
- Find new source for high-resolution book covers
- Book type field: eBook, Paperback, Hardback, etc
- Choose book color automatically based on the primary color of the bookcover when the bookcover changes and no color is already set

### 0.6.0
- Link books (relates to, is translation of, etc)
- Webcam-scanning of bar codes
- Multiple languages (initially English, German, French, Spanish)
- Check for duplicate books (based on title, author, ISBN)
- Automatically select dark or light theme on macOS depending on if the system is in dark mode or not. The user's preferences override this setting.

### 1.0
- Apple and Microsoft certificates
- Update to Electron 3
- Auto-update with Squirrel
- Mac App Store version

### 1.1
- MacBook Touchbar
- Expand reading statistics (see [Notes.md](Notes.md))
- Search for book info using other fields (title, author, etc)

### 1.2
- Reading goals
- Book discovery and recommnded books

### Future Ideas
- Create custom filters
- Synching of database via cloud service of choice

## Icons

From https://glyph.smarticons.co and https://material.io/tools/icons/?style=sharp

---

Alex Seifert - https://www.alexseifert.com

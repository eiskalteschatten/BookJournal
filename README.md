# Book Journal

A digital book journal.

## Release Notes

### 0.6.0
- [x] Support for macOS dark mode
- [x] Fix a bug where "Invalid Date" is shown if no Date Read is given in the book list
- [x] Fix a bug where the categories no longer work in the sidebar and the search doesn't work
- [ ] Fix a bug where the "books by author" no longer works
- [ ] Fix a bug that when a book's color is black, the book is shown as having no color
- [x] Update to Electron 5
- [ ] Print a book
- [ ] Export book as PDF - https://www.npmjs.com/package/html-pdf
- [ ] "Currently Reading" checkbox
- [ ] Book type field: eBook, Paperback, Hardback, etc
- [ ] Choose book color automatically based on the primary color of the bookcover when the bookcover changes and no color is already set
- [ ] Move saved window status (size, position, maximized, etc) to a separate JSON file outside of the database

### 0.5.0
- [x] Fix bug where weird years show up in the statistics even though they don't exist in the database
- [x] Fix bug where multiple modals open after a modal has been closed by clicking on the background
- [x] Fix bug where bookcovers are not automatically added after fetching book info from Google Books
- [x] Fix horizontal scrollbar in modals and the bookform column
- [x] Fix bug in books by author modal where it says "Read on Invalid Date"
- [x] Frontend refinements
    - [x] Modals that can be closed by clicking on the background behind them
    - [x] Animations
    - [x] Books by Author and Preferences modals have "titlebars" that don't scroll away
    - [x] New datepicker
- [x] Update to Electron 3

### 0.4.0
- [x] If NODE_ENV exists and === 'development', use developer DB
- [x] Fix crash when changing book colors (change color, then change again using the same color inspector window)
- [x] Fix bug where bookcovers are not automatically added after fetching book info from Google Books
- [x] Fix bug where 16/09/1887 is sometimes shown in the date started field
- [x] Fix bug where there is an error when no database exists instead of just creating one
- [x] Sort books by date added, date started and date updated
- [x] If there are no books read, the statics page should say that instead of just "spinning" the whole time
- [x] Popup with other works by an author
  - [x] Indication of read or not read
  - [x] Checkbox in preferences to turn it on or off
- [x] Fix Windows-specific bugs

### 0.3.0
- [x] Change location of the database and bookcovers
  - [x] Mac: `~/Library/Application Support/BookJournal`
  - [x] Linux: leave at `~/.bookjournal`
  - [x] Windows: `C:\Users\{User}\AppData\Roaming\Alex Seifert\BookJournal`
- [x] Add database migration strategy for seemless schema updates
- [x] Reading statistics
- [x] "Future Reading" -> "Not Read Yet"

### 0.2.0
- [x] Improve initial loading time
- [x] Preferences: light/dark theme, automatically fetch book information from Google Books (on/off), update automatically (on/off)
- [x] Search
- [x] Sort books by field in the book form

### 0.1.0
- [x] Add books
- [x] Organize them in categories
- [x] Update mechanism
- [x] Dark and light themes
- [x] Automatically fetch book information based on the ISBN - https://developers.google.com/books/docs/v1/using


## Roadmap

### 0.7.0
- [ ] Multiple languages (initially English, German, French, Spanish)
- [ ] Link books (relates to, is translation of, etc)
- [ ] Check for duplicate books (based on title, author, ISBN)
- [ ] Automatically select dark or light theme on macOS depending on if the system is in dark mode or not. The user's preferences override this setting.
- [ ] Find new source for high-resolution book covers

### 1.0.0
- [ ] Apple and Microsoft certificates
- [ ] Auto-update with Squirrel
- [ ] Mac App Store version
- [ ] Webcam-scanning of bar codes

### 1.1.0
- [ ] MacBook Touchbar
- [ ] Expand reading statistics (see [Notes.md](Notes.md))
- [ ] Search for book info using other fields (title, author, etc)

### 1.2.0
- [ ] Reading goals
- [ ] Book discovery and recommnded books
- [ ] Popup with other works by an author
  - [ ] Link to Amazon (Affiliates) with the Amazon country being settable in the preferences
  - [ ] Button to add the book to BookJournal
  - [ ] Sort by title, author or whether read

### Future Ideas
- [ ] Create custom filters
- [ ] Synching of database via cloud service of choice

## Icons

From https://glyph.smarticons.co and https://material.io/tools/icons/?style=sharp

---

Alex Seifert - https://www.alexseifert.com

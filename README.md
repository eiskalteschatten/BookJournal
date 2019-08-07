# Book Journal

[![Build Status](https://travis-ci.org/eiskalteschatten/BookJournal.svg?branch=master)](https://travis-ci.org/eiskalteschatten/BookJournal)

A digital book journal.

![Screenshot](https://raw.githubusercontent.com/eiskalteschatten/BookJournal/master/screenshots/book-light.png)

## Release Notes

### 0.6.0
- [x] Support for macOS dark mode
- [x] Fix a bug where "Invalid Date" is shown if no Date Read is given in the book list
- [x] Fix a bug where the categories no longer work in the sidebar and the search doesn't work
- [x] Fix a bug where the "books by author" no longer works
- [ ] Update to Electron 6
- [ ] "Currently Reading" checkbox
- [ ] Book type field: eBook, Paperback, Hardback, etc
- [ ] Add "Books Read" to the sidebar
- [ ] Move saved window status (size, position, maximized, etc) to a separate JSON file outside of the database
- [x] Add automatic testing and building with Travis CI
- [x] Automatic backups of the database on app launch (launch a background process)

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


## Icons

From https://glyph.smarticons.co and https://material.io/tools/icons/?style=sharp

---

Alex Seifert - https://www.alexseifert.com

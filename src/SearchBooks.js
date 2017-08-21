import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class ListBooks extends Component {

  state = {
    books: [],
    shelfBooks: [],
    query: ''
  }

  componentDidMount() {
    BooksAPI.getAll().then((shelfBooks) => {
      this.setState({ shelfBooks })
    })
  }

  search = (query) => {
    this.setState({ query: query.trim() })
    if (query.length >= 3) {
      query = query.trim()
      BooksAPI.search(query.trim()).then((books) => {
        this.setState((prevState) => {
          let foundBooks = books.map((foundBook) => {

            let shelfBook = prevState.shelfBooks.find(b => b.id === foundBook.id)
            if (shelfBook) {
              foundBook.shelf = shelfBook.shelf
            } else {
              foundBook.shelf = "none"
            }
            return foundBook
          })
          return { books: foundBooks }
        })
      })
    }
  }

  updateStatus = (book, shelf) => {
    BooksAPI.update(book, shelf).then(() => {
      this.setState((prevState) => {
        let updatedBook = prevState.books.find(b => b.id === book.id)
        updatedBook.shelf = shelf
        return { books: prevState.books }
      })
    })
  }

  render() {
    const { books, query } = this.state

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(event) => this.search(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books && books.length > 0 ? books.map((book) => (
              <li key={book.id}>
                <Book book={book} onUpdateStatus={this.updateStatus} />
              </li>
            )) : "No books found"}
          </ol>
        </div>
      </div>
    )
  }
}

export default ListBooks

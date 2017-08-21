import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader'
import * as BooksAPI from './BooksAPI'
import Bookshelf from './Bookshelf'

class ListBooks extends Component {

  state = {
    currentlyReading: [],
    read: [],
    wantToRead: [],
    books: [],
    loading: false
  }

  filterBooks(books) {
    return {
      allBooks: books,
      currentlyReading: books.filter((b) => b.shelf === 'currentlyReading'),
      read: books.filter((b) => b.shelf === 'read'),
      wantToRead: books.filter((b) => b.shelf === 'wantToRead')
    }
  }

  toggleLoading() {
    this.setState((prevState) => ({
      loading: !prevState.loading
    }))
  }

  componentDidMount() {
    this.toggleLoading()
    BooksAPI.getAll().then((books) => {
      this.setState(this.filterBooks(books))
      this.toggleLoading()
    })
  }

  updateStatus = (book, shelf) => {
    this.toggleLoading()
    BooksAPI.update(book, shelf).then(() => {
      this.setState((prevState) => {
        let updatedBook = prevState.allBooks.find(b => b.id === book.id)
        updatedBook.shelf = shelf
        return this.filterBooks(prevState.allBooks)
      })
      this.toggleLoading()
    })
  }

  render() {
    const { currentlyReading, read, wantToRead, loading } = this.state

    return (
      <OverlayLoader
              color={'#2e7c31'}
              loader="RingLoader"
              text=""
              active={loading}
              opacity=".4"
              >
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <Bookshelf
                title="Currently Reading"
                books={currentlyReading}
                onUpdateStatus={this.updateStatus}
              />
              <Bookshelf
                title="Want to Read"
                books={wantToRead}
                onUpdateStatus={this.updateStatus}
              />
              <Bookshelf
                title="Read"
                books={read}
                onUpdateStatus={this.updateStatus}
              />
            </div>
          </div>
          <div className="open-search">
            <Link to="/search">Add a book</Link>
          </div>
        </div>
      </OverlayLoader>
    )
  }
}

export default ListBooks

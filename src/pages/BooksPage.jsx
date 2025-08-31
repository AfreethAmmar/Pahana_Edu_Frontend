import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import SearchBar from '../components/ui/SearchBar';
import FilterDropdown from '../components/ui/FilterDropdown';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StockBadge from '../components/ui/StockBadge';
import Button from '../components/ui/Button';
import { productService } from '../services/productService';
import { BOOK_GENRES, FORM_VALIDATION } from '../utils/constants';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await productService.getBooks();
      if (result.success) {
        setBooks(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = genreFilter.length === 0 || genreFilter.includes(book.genre);
    
    return matchesSearch && matchesGenre;
  });

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await productService.deleteProduct(bookToDelete.productId);
      if (result.success) {
        toast.success('Book deleted successfully');
        fetchBooks();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleBookSubmit = async (data) => {
    try {
      let result;
      if (editingBook) {
        result = await productService.updateProduct(editingBook.productId, data);
      } else {
        result = await productService.createBook(data);
      }

      if (result.success) {
        toast.success(editingBook ? 'Book updated successfully' : 'Book created successfully');
        fetchBooks();
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save book');
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Book Title',
      sortable: true
    },
    {
      key: 'author',
      title: 'Author',
      sortable: true
    },
    {
      key: 'genre',
      title: 'Genre',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'isbn',
      title: 'ISBN'
    },
    {
      key: 'publisher',
      title: 'Publisher'
    },
    {
      key: 'pages',
      title: 'Pages',
      sortable: true
    },
    {
      key: 'price',
      title: 'Price',
      type: 'currency',
      sortable: true
    },
    {
      key: 'quantity',
      title: 'Stock',
      render: (value) => <StockBadge quantity={value} />,
      sortable: true
    }
  ];

  const bookFormFields = [
    {
      name: 'name',
      label: 'Book Title',
      type: 'text',
      required: true,
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'author',
      label: 'Author',
      type: 'text',
      required: true,
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'select',
      required: true,
      options: Object.values(BOOK_GENRES).map(genre => ({ value: genre, label: genre })),
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'isbn',
      label: 'ISBN',
      type: 'text',
      placeholder: 'e.g., 978-0439708180'
    },
    {
      name: 'publisher',
      label: 'Publisher',
      type: 'text'
    },
    {
      name: 'pages',
      label: 'Number of Pages',
      type: 'number',
      min: '1',
      validation: {
        min: { value: 1, message: 'Pages must be at least 1' }
      }
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      step: '0.01',
      min: '0',
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        min: { value: 0, message: FORM_VALIDATION.MIN_PRICE }
      }
    },
    {
      name: 'quantity',
      label: 'Quantity in Stock',
      type: 'number',
      required: true,
      min: '0',
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        min: { value: 0, message: FORM_VALIDATION.MIN_QUANTITY }
      }
    }
  ];

  const genreOptions = Object.values(BOOK_GENRES).map(genre => ({
    value: genre,
    label: genre
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Books
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your book inventory
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button
              variant="primary"
              onClick={handleAddBook}
            >
              Add New Book
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by title, author, ISBN, or publisher..."
          />
          <FilterDropdown
            options={genreOptions}
            selectedValues={genreFilter}
            onSelectionChange={setGenreFilter}
            placeholder="Filter by genre..."
            multiSelect
          />
        </div>

        {/* Books Table */}
        <DataTable
          data={filteredBooks}
          columns={columns}
          loading={loading}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          emptyMessage="No books found"
        />

        {/* Add/Edit Book Modal */}
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingBook ? 'Edit Book' : 'Add New Book'}
          onSubmit={handleBookSubmit}
          fields={bookFormFields}
          initialData={editingBook || {}}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Book"
          message={`Are you sure you want to delete "${bookToDelete?.name}" by ${bookToDelete?.author}? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default BooksPage;
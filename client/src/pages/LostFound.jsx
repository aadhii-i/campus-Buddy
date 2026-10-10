import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Calendar, User, Phone, Mail, X, PackageSearch } from 'lucide-react';
import { lostFoundService } from '../services/lostFoundService';
import { PageHeader, EmptyState, LoadingState } from '../components/common';

const FILTERS = [
  { value: 'all', label: 'All items' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
]

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, lost, found
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'electronics',
    type: 'lost',
    location: '',
    contactInfo: '',
    images: []
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await lostFoundService.getAllItems();
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      // Mock data for development
      setItems([
        {
          _id: '1',
          title: 'Lost iPhone 13',
          description: 'Blue iPhone 13 with a clear case',
          category: 'electronics',
          type: 'lost',
          location: 'Library - 2nd floor',
          contactInfo: 'john@example.com',
          createdAt: new Date().toISOString(),
          user: { name: 'John Doe' },
          images: [{ url: '/images/lost-iphone-13.png', caption: 'Lost blue iPhone 13' }]
        },
        {
          _id: '2',
          title: 'Found Wallet',
          description: 'Brown leather wallet with some cards',
          category: 'personal',
          type: 'found',
          location: 'Main Gate',
          contactInfo: '9876543210',
          createdAt: new Date().toISOString(),
          user: { name: 'Jane Smith' },
          images: [{ url: '/images/found-brown-wallet.png', caption: 'Found brown wallet' }]
        },
        {
          _id: '3',
          title: 'Lost Textbook',
          description: 'Engineering textbook with name written on the first page',
          category: 'books',
          type: 'lost',
          location: 'Academic Block - Room 204',
          contactInfo: 'student@example.com',
          createdAt: new Date().toISOString(),
          user: { name: 'Arjun Menon' },
          images: [{ url: '/images/lost-textbook.png', caption: 'Lost textbook' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lostFoundService.createItem(newItem);
      setShowModal(false);
      setNewItem({
        title: '',
        description: '',
        category: 'electronics',
        type: 'lost',
        location: '',
        contactInfo: '',
        images: []
      });
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          eyebrow="Lost & found"
          title={<>Reunite items with their <span className="marker">owners</span></>}
          description="Search what's been lost or found on campus, or report an item in under a minute."
          actions={
            <button onClick={() => setShowModal(true)} className="btn-primary flex-shrink-0">
              <Plus className="h-4 w-4" />
              Report item
            </button>
          }
        />

        {/* Search and Filters */}
        <div className="surface-panel mt-8 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <label htmlFor="lostfound-search" className="sr-only">Search items</label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
              <input
                id="lostfound-search"
                type="text"
                placeholder="Search by title or description…"
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              role="group"
              aria-label="Filter by type"
              className="no-scrollbar -mx-1 flex flex-shrink-0 gap-2 overflow-x-auto px-1"
            >
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  className={filter === f.value ? 'chip-active' : 'chip'}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <LoadingState label="Loading items…" />
        ) : filteredItems.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={PackageSearch}
              title="No items found"
              description="Try a different search term or filter, or be the first to report an item."
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              // Presentational only: show the first attached photo if the item has one.
              const firstImage = item.images?.[0];
              const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
              const isClosed = item.status === 'resolved' || item.status === 'matched';

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group surface-panel card-interactive flex h-full flex-col overflow-hidden"
                >
                  {/* Media — fixed aspect ratio so every card lines up */}
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-midnight-900/10 bg-midnight-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={firstImage?.caption || item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center bg-brand-100">
                        <div className="pointer-events-none absolute inset-0 bg-dots" />
                        <div className="relative flex flex-col items-center gap-2">
                          <div className="icon-tile h-14 w-14 rounded-2xl bg-surface-0">
                            <PackageSearch className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-medium text-midnight-600">No photo</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className={item.type === 'lost' ? 'badge-danger' : 'badge-success'}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                      {isClosed && (
                        <span className="badge-outline bg-surface-0">{item.status}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {item.category && (
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-midnight-500">
                        {item.category}
                      </p>
                    )}
                    <h3 className="mb-2 line-clamp-1 text-lg font-bold leading-snug text-midnight-900">{item.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-midnight-600">{item.description}</p>

                    <div className="space-y-1.5 border-t border-midnight-900/10 pt-3">
                      <div className="flex items-center gap-2 text-sm text-midnight-600">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-midnight-500" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-midnight-600">
                        <User className="h-4 w-4 flex-shrink-0 text-midnight-500" />
                        <span className="truncate">{item.user?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-midnight-600">
                        <Calendar className="h-4 w-4 flex-shrink-0 text-midnight-500" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-100 px-3.5 py-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-midnight-600">Contact</span>
                        <div className="flex min-w-0 items-center gap-1.5">
                          {item.contactInfo.includes('@') ? (
                            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-midnight-900" />
                          ) : (
                            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-midnight-900" />
                          )}
                          <span className="truncate text-sm font-semibold text-midnight-900">{item.contactInfo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for reporting new item */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-item-title"
              className="modal-panel max-w-lg"
            >
              <div className="modal-header bg-brand-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="icon-tile-dark h-9 w-9">
                    <PackageSearch className="h-4 w-4" />
                  </div>
                  <h3 id="report-item-title" className="text-lg font-bold text-midnight-900">Report an item</h3>
                </div>
                <button onClick={() => setShowModal(false)} aria-label="Close" className="btn-icon">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label htmlFor="report-title" className="form-label">Item title</label>
                  <input
                    id="report-title"
                    type="text"
                    required
                    className="form-input"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="report-description" className="form-label">Description</label>
                  <textarea
                    id="report-description"
                    required
                    rows={3}
                    className="form-textarea"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="report-type" className="form-label">Type</label>
                    <select
                      id="report-type"
                      className="form-select"
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="report-category" className="form-label">Category</label>
                    <select
                      id="report-category"
                      className="form-select"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    >
                      <option value="electronics">Electronics</option>
                      <option value="personal">Personal Items</option>
                      <option value="books">Books</option>
                      <option value="clothing">Clothing</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="report-location" className="form-label">Location</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                    <input
                      id="report-location"
                      type="text"
                      required
                      placeholder="Where was it lost/found?"
                      className="form-input pl-10"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="report-contact" className="form-label">Contact information</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                    <input
                      id="report-contact"
                      type="text"
                      required
                      placeholder="Email or phone number"
                      className="form-input pl-10"
                      value={newItem.contactInfo}
                      onChange={(e) => setNewItem({...newItem, contactInfo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-midnight-900/10 pt-4 sm:flex-row">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LostFound;

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
          user: { name: 'John Doe' }
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
          user: { name: 'Jane Smith' }
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
    <div className="min-h-screen bg-surface-50 pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Lost & found"
          title="Reunite items with their owners"
          description="Search what's been lost or found on campus, or report an item in under a minute."
          actions={
            <button onClick={() => setShowModal(true)} className="btn-primary flex-shrink-0">
              <Plus className="h-4 w-4" />
              Report item
            </button>
          }
        />

        {/* Search and Filters */}
        <div className="surface-panel mt-8 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
              <input
                type="text"
                placeholder="Search by title or description…"
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-shrink-0 gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === f.value ? 'bg-brand-600 text-white' : 'bg-midnight-100 text-midnight-600 hover:bg-midnight-200'
                  }`}
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
          <div className="mt-4">
            <EmptyState
              icon={PackageSearch}
              title="No items found"
              description="Try a different search term or filter, or be the first to report an item."
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group overflow-hidden rounded-2xl border-l-4 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover ${
                  item.type === 'lost' ? 'border-l-rose-400' : 'border-l-emerald-400'
                }`}
              >
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-midnight-900">{item.title}</h3>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      item.type === 'lost'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-midnight-500">{item.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-midnight-500">
                      <MapPin className="h-4 w-4 text-midnight-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-midnight-500">
                      <User className="h-4 w-4 text-midnight-400" />
                      <span>{item.user?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-midnight-500">
                      <Calendar className="h-4 w-4 text-midnight-400" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-midnight-100 pt-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-midnight-400">Contact</span>
                    <div className="flex items-center gap-1.5">
                      {item.contactInfo.includes('@') ? (
                        <Mail className="h-3.5 w-3.5 text-brand-600" />
                      ) : (
                        <Phone className="h-3.5 w-3.5 text-brand-600" />
                      )}
                      <span className="text-sm font-semibold text-brand-700">{item.contactInfo}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/60 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-card-hover"
            >
              <div className="flex items-center justify-between border-b border-midnight-100 px-6 py-4">
                <h3 className="text-lg font-bold text-midnight-900">Report an item</h3>
                <button onClick={() => setShowModal(false)} className="rounded-full p-1.5 text-midnight-400 hover:bg-midnight-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="form-label">Item title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="form-textarea"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <select
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
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Where was it lost/found?"
                    className="form-input"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Contact information</label>
                  <input
                    type="text"
                    required
                    placeholder="Email or phone number"
                    className="form-input"
                    value={newItem.contactInfo}
                    onChange={(e) => setNewItem({...newItem, contactInfo: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
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

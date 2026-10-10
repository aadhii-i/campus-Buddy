import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, MessageCircle, Share2, Calendar, Tag, X, Users } from 'lucide-react';
import { PageHeader, LoadingState, EmptyState } from '../components/common';

const CATEGORY_STYLES = {
  general: 'badge-neutral',
  study: 'badge-lilac',
  events: 'badge-lime',
  'lost-found': 'badge-outline',
  announcements: 'badge-ink',
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setPosts([
        {
          _id: '1',
          title: 'Study Group for Data Structures',
          content: 'Looking for students to form a study group for Data Structures and Algorithms. We can meet twice a week in the library.',
          category: 'study',
          tags: ['DSA', 'study-group', 'computer-science'],
          author: { name: 'Alex Johnson', avatar: null },
          createdAt: new Date().toISOString(),
          likes: 12,
          comments: 5,
          isLiked: false
        },
        {
          _id: '2',
          title: 'Lost and Found: Blue Notebook',
          content: 'Found a blue notebook with chemistry notes near the cafeteria. Contact me if it\'s yours!',
          category: 'lost-found',
          tags: ['chemistry', 'notebook'],
          author: { name: 'Sarah Chen', avatar: null },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: 8,
          comments: 2,
          isLiked: true
        },
        {
          _id: '3',
          title: 'Campus Event: Tech Talk on AI',
          content: 'Exciting tech talk on Artificial Intelligence next Friday at 3 PM in the main auditorium. Don\'t miss it!',
          category: 'events',
          tags: ['AI', 'tech-talk', 'event'],
          author: { name: 'Mike Davis', avatar: null },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          likes: 25,
          comments: 8,
          isLiked: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would call the API
      const newPostData = {
        ...newPost,
        _id: Date.now().toString(),
        author: { name: 'Current User' },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false
      };

      setPosts([newPostData, ...posts]);
      setShowModal(false);
      setNewPost({
        title: '',
        content: '',
        category: 'general',
        tags: []
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post._id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const filteredPosts = posts.filter(post =>
    filter === 'all' || post.category === filter
  );

  const getCategoryStyle = (category) => CATEGORY_STYLES[category] || CATEGORY_STYLES.general;

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Campus community"
          title="Where campus conversations happen"
          description="Study groups, announcements, and everything students are talking about right now."
          actions={
            <button onClick={() => setShowModal(true)} className="btn-primary flex-shrink-0">
              <Plus className="h-4 w-4" />
              New post
            </button>
          }
        />

        {/* Category navigation */}
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter posts by category">
          {['all', 'general', 'study', 'events', 'lost-found', 'announcements'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`capitalize ${filter === category ? 'chip-active' : 'chip'}`}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <LoadingState label="Loading posts…" />
        ) : filteredPosts.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={Users} title="Nothing here yet" description="No posts found in this category — be the first to start a conversation." />
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="surface-panel p-6 transition-[border-color] duration-300 hover:border-midnight-900/25"
              >
                {/* Post Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-midnight-900/10 bg-brand-200 text-sm font-semibold text-midnight-900">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="truncate font-semibold text-midnight-900">{post.author.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-midnight-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 ${getCategoryStyle(post.category)}`}>
                    {post.category.replace('-', ' ')}
                  </span>
                </div>

                <h2 className="mb-2 text-lg font-bold text-midnight-900">{post.title}</h2>
                <p className="mb-4 leading-relaxed text-midnight-600">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 rounded-full border border-midnight-900/10 bg-surface-50 px-2.5 py-1 text-xs text-midnight-600">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5 border-t border-midnight-900/10 pt-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    aria-pressed={post.isLiked}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      post.isLiked
                        ? 'border-midnight-900 bg-glow-400 text-midnight-900'
                        : 'border-transparent text-midnight-600 hover:border-midnight-900/15 hover:bg-surface-50 hover:text-midnight-900'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>

                  <button className="flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.5 text-sm font-medium text-midnight-600 transition-colors hover:border-midnight-900/15 hover:bg-surface-50 hover:text-midnight-900">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>

                  <button className="flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.5 text-sm font-medium text-midnight-600 transition-colors hover:border-midnight-900/15 hover:bg-surface-50 hover:text-midnight-900">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
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
              aria-labelledby="community-post-title"
              className="modal-panel max-w-lg"
            >
              <div className="modal-header bg-brand-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="icon-tile-dark h-9 w-9">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <h3 id="community-post-title" className="text-lg font-bold text-midnight-900">Create a post</h3>
                </div>
                <button type="button" onClick={() => setShowModal(false)} aria-label="Close" className="btn-icon">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label htmlFor="post-title" className="form-label">Title</label>
                  <input
                    id="post-title"
                    type="text"
                    required
                    className="form-input"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="post-content" className="form-label">Content</label>
                  <textarea
                    id="post-content"
                    required
                    rows={5}
                    className="form-textarea"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="post-category" className="form-label">Category</label>
                  <select
                    id="post-category"
                    className="form-select"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="study">Study</option>
                    <option value="events">Events</option>
                    <option value="lost-found">Lost & Found</option>
                    <option value="announcements">Announcements</option>
                  </select>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-midnight-900/10 pt-5 sm:flex-row">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Post
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

export default Community;

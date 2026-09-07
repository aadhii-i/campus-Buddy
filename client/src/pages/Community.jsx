import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, MessageCircle, Share2, Calendar, Tag, X, Users } from 'lucide-react';
import { PageHeader, LoadingState, EmptyState } from '../components/common';

const CATEGORY_STYLES = {
  general: 'bg-midnight-100 text-midnight-600',
  study: 'bg-brand-50 text-brand-700',
  events: 'bg-emerald-50 text-emerald-700',
  'lost-found': 'bg-amber-50 text-amber-700',
  announcements: 'bg-violet-50 text-violet-700',
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
    <div className="min-h-screen bg-surface-50 pb-20 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
        <div className="surface-panel mt-8 flex flex-wrap gap-2 p-4">
          {['all', 'general', 'study', 'events', 'lost-found', 'announcements'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === category
                  ? 'bg-brand-600 text-white'
                  : 'bg-midnight-100 text-midnight-600 hover:bg-midnight-200'
              }`}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <LoadingState label="Loading posts…" />
        ) : filteredPosts.length === 0 ? (
          <div className="mt-4">
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
                className="surface-panel p-6"
              >
                {/* Post Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-midnight-900">{post.author.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-midnight-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${getCategoryStyle(post.category)}`}>
                    {post.category.replace('-', ' ')}
                  </span>
                </div>

                <h2 className="mb-2 text-lg font-bold text-midnight-900">{post.title}</h2>
                <p className="mb-4 leading-relaxed text-midnight-600">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 rounded-full bg-midnight-50 px-2.5 py-1 text-xs text-midnight-500">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-midnight-100 pt-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      post.isLiked
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'text-midnight-500 hover:bg-midnight-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>

                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-midnight-500 transition-colors hover:bg-midnight-50">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>

                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-midnight-500 transition-colors hover:bg-midnight-50">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/60 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-card-hover"
            >
              <div className="flex items-center justify-between border-b border-midnight-100 px-6 py-4">
                <h3 className="text-lg font-bold text-midnight-900">Create a post</h3>
                <button onClick={() => setShowModal(false)} className="rounded-full p-1.5 text-midnight-400 hover:bg-midnight-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Content</label>
                  <textarea
                    required
                    rows={5}
                    className="form-textarea"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
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

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
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

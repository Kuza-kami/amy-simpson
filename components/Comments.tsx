import React, { useState, useEffect } from 'react';
import { ProjectComment } from '../types';
import { Send, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsProps {
  projectId: number;
}

const Comments: React.FC<CommentsProps> = ({ projectId }) => {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Load comments from local storage
  useEffect(() => {
    const saved = localStorage.getItem(`comments_project_${projectId}`);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse comments", e);
      }
    } else {
        // Default dummy comment for demonstration
        setComments([
            {
                id: 'init-1',
                projectId,
                author: 'Studio Lead',
                text: 'Outstanding attention to detail on the hem construction.',
                timestamp: new Date()
            }
        ]);
    }
  }, [projectId]);

  // Save comments to local storage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_project_${projectId}`, JSON.stringify(comments));
    }
  }, [comments, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;

    const newComment: ProjectComment = {
      id: Date.now().toString(),
      projectId,
      author,
      text,
      timestamp: new Date()
    };

    setComments(prev => [newComment, ...prev]);
    setText('');
    setAuthor('');
    setIsFocused(false);
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare size={18} className="text-design-blue" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-design-black dark:text-white">
          Critique & Feedback
        </h3>
        <span className="bg-gray-100 dark:bg-[#222] text-xs font-mono px-2 py-0.5 rounded-full ml-2">
            {comments.length}
        </span>
      </div>

      {/* Input Form */}
      <motion.form 
        layout
        onSubmit={handleSubmit} 
        className={`mb-10 bg-gray-50 dark:bg-[#151515] border-2 rounded-2xl p-4 transition-colors duration-300 ${isFocused ? 'border-design-blue' : 'border-gray-200 dark:border-gray-800'}`}
        onFocus={() => setIsFocused(true)}
      >
        <div className="flex flex-col gap-4">
            {isFocused && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <input 
                        type="text" 
                        placeholder="Your Name / Role"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full bg-transparent text-sm font-bold border-b border-gray-200 dark:border-gray-700 py-2 focus:outline-none focus:border-design-blue text-design-black dark:text-white"
                    />
                </motion.div>
            )}
            
            <div className="flex gap-4 items-start">
                <textarea
                    placeholder="Leave a note on the composition..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={isFocused ? 3 : 1}
                    className="w-full bg-transparent text-sm resize-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                />
                <button 
                    type="submit"
                    disabled={!text.trim() || !author.trim()}
                    className="bg-design-black dark:bg-white text-white dark:text-black p-3 rounded-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence mode='popLayout'>
            {comments.map((comment) => (
                <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="group flex gap-4"
                >
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-design-black dark:text-white shadow-sm group-hover:border-design-yellow transition-colors">
                            <User size={16} />
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-[#1a1a1a] p-4 rounded-r-2xl rounded-bl-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-design-black dark:text-white">
                                {comment.author}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                                {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {comment.text}
                        </p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
            <div className="text-center py-8 opacity-50">
                <p className="text-xs font-mono uppercase">No notes yet. Be the first to mark it up.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
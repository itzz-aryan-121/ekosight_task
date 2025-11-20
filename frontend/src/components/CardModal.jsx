import { useState, useEffect } from 'react';
import { boardAPI } from '../services/api';
import { toast } from '../lib/toast';

const CardModal = ({ card, board, onClose, onUpdate }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
  const [tags, setTags] = useState(card.tags ? card.tags.join(', ') : '');
  const [listId, setListId] = useState(card.listId);
  const [saving, setSaving] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoadingRec(true);
    try {
      const data = await boardAPI.getRecommendations(board._id, card._id);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoadingRec(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning('Card title required', 'Please enter a title for your card');
      return;
    }

    setSaving(true);
    try {
      const updates = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        listId,
      };
      await onUpdate(card._id, updates);
      onClose();
    } catch (error) {
      console.error('Failed to update card:', error);
      toast.error('Failed to update card', error.response?.data?.message || 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyRecommendation = (type, value) => {
    if (type === 'dueDate') {
      setDueDate(new Date(value).toISOString().split('T')[0]);
      toast.info('Due date applied', 'You can save changes to update the card');
    } else if (type === 'move') {
      setListId(value);
      toast.info('List changed', 'You can save changes to update the card');
    }
  };

  const sortedLists = [...(board.lists || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(255,215,0,0.4)]">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Edit Card</h2>
              <p className="text-white/50 text-sm">Update card details and settings</p>
            </div>
            <button
              onClick={onClose}
              className="text-yellow-400/70 hover:text-yellow-300 hover:bg-yellow-500/10 p-2 rounded-lg transition-all duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                placeholder="Enter card title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 resize-none"
                placeholder="Add a description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  List
                </label>
                <select
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                >
                  {sortedLists.map((list) => (
                    <option key={list._id} value={list._id} className="bg-black text-white">
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
              />
            </div>

            {recommendations && (
              <div className="border-t border-yellow-500/20 pt-6 mt-6">
                <h3 className="font-bold text-white mb-4 text-lg drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">Smart Recommendations</h3>
                <div className="space-y-3">
                  {recommendations.dueDateSuggestion && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-yellow-300 mb-1">Suggested Due Date</p>
                          <p className="text-sm text-yellow-200/80">
                            {new Date(recommendations.dueDateSuggestion).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleApplyRecommendation('dueDate', recommendations.dueDateSuggestion)}
                          className="px-4 py-2 bg-yellow-500 text-black text-sm rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-200 font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {recommendations.movementSuggestion && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-yellow-300 mb-1">Suggested Movement</p>
                          <p className="text-sm text-yellow-200/80">
                            Move from "{recommendations.movementSuggestion.from}" to "{recommendations.movementSuggestion.to}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleApplyRecommendation('move', recommendations.movementSuggestion.targetListId)}
                          className="px-4 py-2 bg-yellow-500 text-black text-sm rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-200 font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {recommendations.relatedCards && recommendations.relatedCards.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-yellow-300 mb-2">Related Cards</p>
                      <ul className="list-disc list-inside space-y-1">
                        {recommendations.relatedCards.map((related) => (
                          <li key={related.id} className="text-sm text-yellow-200/80">
                            {related.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {loadingRec && (
              <div className="text-sm text-yellow-400/70 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Loading recommendations...
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-yellow-500/20">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-white bg-black/50 border border-white/10 rounded-xl hover:bg-black/70 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;


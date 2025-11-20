import { useState, useEffect } from 'react';
import { boardAPI } from '../services/api';

const RecommendationsPanel = ({ board, onCardClick }) => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (board && board.cards) {
      board.cards.forEach((card) => {
        fetchRecommendations(card._id);
      });
    }
  }, [board]);

  const fetchRecommendations = async (cardId) => {
    setLoading((prev) => ({ ...prev, [cardId]: true }));
    try {
      const data = await boardAPI.getRecommendations(board._id, cardId);
      setRecommendations((prev) => ({ ...prev, [cardId]: data }));
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [cardId]: false }));
    }
  };

  const hasAnyRecommendations = () => {
    return Object.values(recommendations).some((rec) => {
      if (!rec) return false;
      return rec.dueDateSuggestion || rec.movementSuggestion || (rec.relatedCards && rec.relatedCards.length > 0);
    });
  };

  if (!hasAnyRecommendations() && Object.keys(loading).length === 0) {
    return (
      <div className="bg-black/70 backdrop-blur-xl border border-yellow-500/30 rounded-xl sm:rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.2)] p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-yellow-500/30 flex-shrink-0">
            <span className="text-lg sm:text-xl">💡</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Recommendations</h3>
        </div>
        <p className="text-white/60 text-xs sm:text-sm pl-0 sm:pl-13">No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-black/70 backdrop-blur-xl border border-yellow-500/30 rounded-xl sm:rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.2)] p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Smart Recommendations</h3>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {board.cards && board.cards.map((card) => {
          const rec = recommendations[card._id];
          const isLoading = loading[card._id];

          if (isLoading) {
            return (
              <div key={card._id} className="border-b border-yellow-500/20 pb-3 sm:pb-4 mb-3 sm:mb-4 last:border-b-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-400/70">
                  <span className="animate-spin">⏳</span>
                  <span className="truncate">Loading recommendations for "{card.title}"...</span>
                </div>
              </div>
            );
          }

          if (!rec) return null;

          const hasRec = rec.dueDateSuggestion || rec.movementSuggestion || (rec.relatedCards && rec.relatedCards.length > 0);
          if (!hasRec) return null;

          return (
            <div key={card._id} className="border-b border-yellow-500/20 pb-3 sm:pb-4 mb-3 sm:mb-4 last:border-b-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                <h4 className="font-semibold text-white text-sm sm:text-base truncate flex-1">{card.title}</h4>
                <button
                  onClick={() => onCardClick(card)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium whitespace-nowrap flex-shrink-0"
                >
                  View Card
                </button>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                {rec.dueDateSuggestion && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <p className="text-yellow-200 break-words">
                      <span className="font-semibold text-yellow-300">Suggested Due Date:</span>{' '}
                      {new Date(rec.dueDateSuggestion).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {rec.movementSuggestion && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <p className="text-yellow-200 break-words">
                      <span className="font-semibold text-yellow-300">Suggested Movement:</span>{' '}
                      Move from "{rec.movementSuggestion.from}" to "{rec.movementSuggestion.to}"
                    </p>
                  </div>
                )}

                {rec.relatedCards && rec.relatedCards.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <p className="text-yellow-300 font-semibold mb-1.5 sm:mb-2">Related Cards:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.relatedCards.map((related) => (
                        <li key={related.id} className="text-yellow-200/80 break-words">
                          {related.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationsPanel;


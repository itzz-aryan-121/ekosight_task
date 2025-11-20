import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI } from '../services/api';
import { toast } from '../lib/toast';
import RecommendationsPanel from '../components/RecommendationsPanel';
import CardModal from '../components/CardModal';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardListId, setNewCardListId] = useState('');
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const data = await boardAPI.getById(id);
      setBoard(data);
      if (data.lists && data.lists.length > 0 && !newCardListId) {
        setNewCardListId(data.lists[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
      toast.error('Failed to load board', error.response?.data?.message || 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.warning('Email required', 'Please enter an email address');
      return;
    }

    setInviting(true);
    try {
      const data = await boardAPI.invite(id, inviteEmail);
      setBoard(data.board);
      setInviteEmail('');
      setShowInviteModal(false);
      toast.success('Invitation sent!', `${inviteEmail} has been invited to this board`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to invite user';
      toast.error('Invitation failed', errorMessage);
    } finally {
      setInviting(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !newCardListId) {
      toast.warning('Card title required', 'Please enter a title for your card');
      return;
    }

    try {
      await boardAPI.addCard(id, {
        title: newCardTitle,
        description: newCardDescription,
        listId: newCardListId,
      });
      setNewCardTitle('');
      setNewCardDescription('');
      setShowAddCardModal(false);
      toast.success('Card added!', `"${newCardTitle}" has been created successfully`);
      fetchBoard();
    } catch (error) {
      console.error('Failed to add card:', error);
      toast.error('Failed to add card', error.response?.data?.message || 'Please try again');
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      await boardAPI.updateCard(id, cardId, updates);
      fetchBoard();
      if (selectedCard && selectedCard._id === cardId) {
        setSelectedCard({ ...selectedCard, ...updates });
      }
      toast.success('Card updated!', 'Changes have been saved successfully');
    } catch (error) {
      console.error('Failed to update card:', error);
      toast.error('Failed to update card', error.response?.data?.message || 'Please try again');
    }
  };

  const getCardsForList = (listId) => {
    if (!board || !board.cards) return [];
    return board.cards.filter(card => String(card.listId) === String(listId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Loading board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">Board not found</div>
      </div>
    );
  }

  const sortedLists = [...(board.lists || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-black relative flex flex-col ">
      <nav className="bg-black/80 backdrop-blur-xl border-b border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/boards')}
                className="text-yellow-400/80 hover:text-yellow-300 hover:bg-yellow-500/10 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                ← Back
              </button>
              <div className="h-8 w-px bg-yellow-500/20"></div>
              <h1 className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{board.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="px-4 py-2 bg-yellow-500/90 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] text-sm font-semibold transition-all duration-200"
              >
                {showRecommendations ? 'Hide' : 'Show'} Recommendations
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] text-sm font-semibold transition-all duration-200"
              >
                Invite
              </button>
              <div className="h-8 w-px bg-yellow-500/20"></div>
              <span className="text-sm text-white/80">Hello, <span className="text-yellow-400 font-semibold">{user?.name}</span></span>
              <button
                onClick={logout}
                className="text-sm text-yellow-400/80 hover:text-yellow-300 hover:bg-yellow-500/10 px-3 py-1.5 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showRecommendations && (
          <div className="mb-6">
            <RecommendationsPanel board={board} onCardClick={handleCardClick} />
          </div>
        )}

        <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-black/50" style={{ scrollbarWidth: 'thin' }}>
          {sortedLists.map((list) => {
            const listCards = getCardsForList(list._id);
            return (
              <div
                key={list._id}
                className=" w-72 bg-black/70 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] flex flex-col"
                style={{ minHeight: 'calc(100vh - 200px)' }}
              >
               
                <div className="px-5 py-4 border-b border-yellow-500/20 bg-black/40 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] leading-tight">
                      {list.title}
                    </h3>
                    <span className="text-xs text-yellow-400/80 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/30 font-semibold leading-normal">
                      {listCards.length}
                    </span>
                  </div>
                </div>

               
                <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  {listCards.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-white/40 text-sm leading-relaxed">No cards yet</p>
                    </div>
                  ) : (
                    listCards.map((card) => (
                      <div
                        key={card._id}
                        onClick={() => handleCardClick(card)}
                        className="bg-gradient-to-br from-black/60 to-black/40 border border-yellow-500/30 rounded-xl p-4.5 cursor-pointer hover:border-yellow-500/70 hover:bg-gradient-to-br hover:from-black/80 hover:to-black/60 hover:shadow-[0_4px_20px_rgba(255,215,0,0.3)] hover:scale-[1.02] transition-all duration-200 group"
                      >
                        <h4 className="font-semibold text-white mb-2.5 text-sm group-hover:text-yellow-200 transition-colors leading-tight">
                          {card.title}
                        </h4>
                        {card.description && (
                          <p className="text-xs text-white/60 line-clamp-3 mb-3.5 leading-relaxed">
                            {card.description}
                          </p>
                        )}
                        
                       
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-yellow-500/10">
                          <div className="flex items-center gap-2 flex-wrap">
                            {card.dueDate && (
                              <div className="flex items-center gap-1.5 text-xs leading-normal">
                                
                                <span className="text-yellow-400/70">
                                  {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                            {card.tags && card.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {card.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-1 rounded-full font-medium leading-normal"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {card.tags.length > 2 && (
                                  <span className="text-xs text-yellow-400/60 px-1 leading-normal">
                                    +{card.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              
                <div className="px-4 py-4 border-t border-yellow-500/20 bg-black/40 rounded-b-2xl">
                  <button
                    onClick={() => {
                      setNewCardListId(list._id);
                      setShowAddCardModal(true);
                    }}
                    className="w-full text-left text-sm text-yellow-400/70 hover:text-yellow-300 py-2.5 px-3 rounded-xl hover:bg-yellow-500/10 transition-all duration-200 flex items-center gap-2 font-medium leading-normal"
                  >
                    <span className="text-lg font-bold">+</span>
                    <span>Add a card</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(255,215,0,0.4)]">
            <h3 className="text-xl font-bold mb-2 text-white">Invite User to Board</h3>
            <p className="text-white/50 text-sm mb-6">Add a team member to collaborate on this board</p>
            <form onSubmit={handleInvite} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="px-5 py-2.5 text-white bg-black/50 border border-white/10 rounded-xl hover:bg-black/70 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm"
                >
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(255,215,0,0.4)]">
            <h3 className="text-xl font-bold mb-2 text-white">Add New Card</h3>
            <p className="text-white/50 text-sm mb-6">Create a new task card</p>
            <form onSubmit={handleAddCard} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  List
                </label>
                <select
                  value={newCardListId}
                  onChange={(e) => setNewCardListId(e.target.value)}
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
                  Title
                </label>
                <input
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="Enter card title"
                  className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Description
                </label>
                <textarea
                  value={newCardDescription}
                  onChange={(e) => setNewCardDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows="3"
                  className="w-full px-4 py-3 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCardModal(false);
                    setNewCardTitle('');
                    setNewCardDescription('');
                  }}
                  className="px-5 py-2.5 text-white bg-black/50 border border-white/10 rounded-xl hover:bg-black/70 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCardTitle.trim()}
                  className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCardModal && selectedCard && (
        <CardModal
          card={selectedCard}
          board={board}
          onClose={() => {
            setShowCardModal(false);
            setSelectedCard(null);
          }}
          onUpdate={handleUpdateCard}
        />
      )}
    </div>
  );
};

export default BoardDetail;


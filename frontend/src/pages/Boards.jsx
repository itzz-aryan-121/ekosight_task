import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI } from '../services/api';
import { toast } from '../lib/toast';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [creating, setCreating] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await boardAPI.getAll();
      setBoards(data);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      toast.error('Failed to load boards', error.response?.data?.message || 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      toast.warning('Board name required', 'Please enter a name for your board');
      return;
    }

    setCreating(true);
    try {
      const newBoard = await boardAPI.create(boardName);
      setBoards([...boards, newBoard]);
      setBoardName('');
      setShowCreateModal(false);
      toast.success('Board created!', `"${boardName}" has been created successfully`);
      navigate(`/boards/${newBoard._id}`);
    } catch (error) {
      console.error('Failed to create board:', error);
      toast.error('Failed to create board', error.response?.data?.message || 'Please try again');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <nav className="bg-black/80 backdrop-blur-xl border-b border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
             
              <h1 className="text-xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Task Board</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80">Hello, <span className="text-yellow-400 font-semibold">{user?.name}</span></span>
              <div className="h-8 w-px bg-yellow-500/20"></div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mb-3 leading-tight">
              My Boards
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">Manage your task boards and projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-500 text-black px-6 py-3.5 rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] transition-all duration-200 font-bold text-sm flex items-center gap-2 leading-normal"
          >
            <span className="text-lg font-bold">+</span>
            <span>Create Board</span>
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 text-6xl">📋</div>
            <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              No boards yet
            </h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Get started by creating your first board to organize your tasks and projects
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all duration-300 font-bold"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() => navigate(`/boards/${board._id}`)}
                className="from-black/70 to-black/50 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] p-6 cursor-pointer hover:border-yellow-500/70 hover:shadow-[0_0_35px_rgba(255,215,0,0.3)] hover:scale-[1.02] transition-all duration-200 group"
              >
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white mb-0 group-hover:text-yellow-200 transition-colors leading-tight">
                    {board.name}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm mb-5">
                  <div className="flex items-center gap-1.5 text-yellow-400/80">
                    
                    <span className="font-semibold leading-normal">{board.lists?.length || 0}</span>
                    <span className="text-white/60 leading-normal">lists</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-400/80">
                   
                    <span className="font-semibold leading-normal">{board.cards?.length || 0}</span>
                    <span className="text-white/60 leading-normal">cards</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-yellow-500/20">
                  <span className="text-xs text-yellow-400/60 group-hover:text-yellow-300 transition-colors leading-relaxed">
                    Click to open →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(255,215,0,0.4)]">
            <h3 className="text-xl font-bold mb-3 text-white leading-tight">Create New Board</h3>
            <p className="text-white/50 text-sm mb-7 leading-relaxed">Give your board a name to get started</p>
            <form onSubmit={handleCreateBoard} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2.5 leading-normal">Board name</label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Enter board name"
                  className="w-full px-4 py-3.5 border border-yellow-500/40 bg-black/50 text-white placeholder-yellow-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 text-base leading-normal"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setBoardName('');
                  }}
                  className="px-5 py-2.5 text-white bg-black/50 border border-white/10 rounded-xl hover:bg-black/70 transition-all duration-200 font-medium text-sm leading-normal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !boardName.trim()}
                  className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm leading-normal"
                >
                  {creating ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boards;


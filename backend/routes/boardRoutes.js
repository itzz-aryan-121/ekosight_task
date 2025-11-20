import express from 'express';
import Board from '../models/Board.js';
import User from '../models/User.js';
import { buildRecommendations } from '../services/recommendationService.js';
import authenticate from '../middleware/auth.js';


const router = express.Router();


router.get('/', authenticate, async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [{
                owner: req.user._id
            }, {
                members: req.user._id
            }]
        });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

router.post('/', authenticate, async (req, res) => {
    try {
        const board = new Board({
            name: req.body.name,
            owner: req.user._id,
            lists: [
                {
                    title: 'To Do', order: 0,
                },
                {
                    title: 'In Progress', order: 1,
                },
                {
                    title: 'Done', order: 2,
                }
            ]
        });
        await board.save();
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})


router.get("/:id", authenticate, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: "Not found" });

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post("/:id/invite", authenticate, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: "Board not found" });
        
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!board.members.includes(user._id)) board.members.push(user._id);

        await board.save();
        res.json({ message: "User invited", board });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post("/:id/cards", authenticate, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: "Board not found" });
        
        board.cards.push(req.body);
        await board.save();
        res.json(board.cards[board.cards.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put("/:id/cards/:cardId", authenticate, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: "Board not found" });
        
        const card = board.cards.id(req.params.cardId);
        if (!card) return res.status(404).json({ message: "Card not found" });

        Object.assign(card, req.body);
        await board.save();

        res.json(card);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get("/:id/cards/:cardId/recommendations", authenticate, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: "Board not found" });
        
        const card = board.cards.id(req.params.cardId);
        if (!card) return res.status(404).json({ message: "Card not found" });
        
        res.json(buildRecommendations(card.toObject(), board.toObject()));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
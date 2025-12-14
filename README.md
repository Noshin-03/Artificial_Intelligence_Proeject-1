# ♟️ Chess Attack - 5×6 Minichess with AI

A smart and challenging 5×6 Minichess game powered by artificial intelligence. Play against an AI opponent that uses advanced game theory algorithms to give you a real challenge! 


## 🎯 What is Chess Attack?

Chess Attack is a compact version of traditional chess played on a 5×6 board. It keeps all the strategic depth of regular chess but wraps it up in faster, more intense games. Perfect for quick matches or learning chess tactics! 

The AI opponent isn't just making random moves - it's actually thinking several moves ahead, evaluating positions, and trying to outsmart you using the same principles that power chess engines.

## ✨ Features

### Game Modes
- **Human vs AI** - Challenge the computer at different difficulty levels
- **AI vs AI** - Watch two AI players battle it out (great for testing strategies!)
- **Human vs Human** - Classic two-player mode on the same device

### Smart AI Opponent
- **Minimax Algorithm** - The AI explores future game states to find the best move
- **Alpha-Beta Pruning** - Smart optimization that makes the AI think faster without sacrificing strength
- **Strategic Evaluation** - Considers both piece values and positioning, not just material count
- **Adjustable Difficulty** - Change the search depth to make the AI easier or harder

### User Interface
- Clean, intuitive React-based interface
- Drag-and-drop piece movement
- Visual highlighting of legal moves
- Real-time move validation
- Game state indicators (check, checkmate, stalemate)
- Move history tracking
- Smooth animations and responsive design

## 🛠️ Installation

### Prerequisites
Make sure you have these installed on your system:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Noshin-03/Artificial_Intelligence_Proeject-1.git
   cd Artificial_Intelligence_Proeject-1
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   The terminal will show you a URL (usually `http://localhost:5173`). Open it in your browser and start playing!

### Building for Production

If you want to create an optimized production build: 

```bash
npm run build
```

Then preview the production build: 

```bash
npm run preview
```

## 🧠 How the AI Works

The AI in Chess Attack uses some really cool computer science concepts to play strategically:

### Minimax Algorithm

Think of it like this: the AI imagines a tree of possible future moves. For every move it could make, it considers what you might do in response, then what it would do after that, and so on. It assumes you'll play perfectly (trying to minimize its advantage) while it tries to maximize its advantage - hence "minimax."

The algorithm explores these possibilities up to a certain depth (like thinking 4 or 5 moves ahead) and picks the path that leads to the best outcome. 

### Alpha-Beta Pruning

Here's where it gets clever.  Imagine the AI is exploring a branch of moves and realizes "Wait, no matter what happens here, this is worse than something I've already found." It immediately stops exploring that branch and moves on.  This "pruning" can cut down the number of positions the AI needs to evaluate by 50-90%, making it way faster without losing any accuracy.

### Position Evaluation

When the AI reaches its thinking limit, it needs to judge "Who's winning?" It looks at: 

1. **Material Count** - Obviously, having more pieces is good.  Queens are worth more than pawns, etc.
   - Pawn:  100 points
   - Knight: 320 points
   - Bishop: 330 points
   - Rook: 500 points
   - Queen: 900 points
   - King:  20,000 points (losing it = game over!)

2. **Piece Position** - Not all squares are equal!  The AI uses "piece-square tables" that give bonuses for good positioning: 
   - Pawns get bonuses for advancing toward promotion
   - Knights prefer central squares where they control more of the board
   - Kings prefer safety in the early game
   - Bishops like diagonal control

3. **Tactical Factors** - The AI recognizes special situations like checkmate (game over!) and stalemate (it's a draw).

### Search Depth & Performance

The deeper the AI thinks, the stronger it plays, but it also takes longer: 
- **Depth 3**:  ~8,000 positions checked (fast, decent)
- **Depth 4**: ~160,000 positions (good balance)
- **Depth 5**: ~3.2 million positions (strong but slower)

You can adjust this based on how challenging you want the game to be! 

## 📁 Project Structure

```
Chess-Attack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── brain/
│   │   │   │   ├── ChessEngine.js    # AI logic & minimax
│   │   │   │   └── MoveRules.js      # Chess rules & move generation
│   │   │   └── [UI components]
│   │   ├── App.jsx                   # Main application
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   └── vite.config.js
├── CHESS_RULES_GUIDE. md
├── OPTIMIZATION_GUIDE.md
└── README.md
```

## 🎮 How to Play

1. Start the application
2. Select your game mode (Human vs AI recommended for first-time players)
3. Choose AI difficulty if playing against the computer
4. Click on a piece to see its legal moves (highlighted squares)
5. Click on a highlighted square to move there
6. Try to checkmate your opponent's king!

## 🎓 Technical Details

- **Frontend Framework**: React 19. x with Vite
- **Language**: JavaScript (ES6+)
- **Build Tool**: Vite (blazing fast development)
- **AI Algorithm**: Minimax with Alpha-Beta Pruning
- **Code Style**: ESLint configured for consistent formatting

## 📚 Additional Resources

- [Chess Rules Guide](CHESS_RULES_GUIDE.md) - Complete minichess rules
- [Optimization Guide](OPTIMIZATION_GUIDE. md) - Performance tips and AI tuning

## 👥 Team

**TECHNITOS**

## 🤝 Contributing

This is an academic project, but if you find bugs or have suggestions, feel free to open an issue! 

## 📝 License

This project was created as part of an Artificial Intelligence course assignment.

## 🙏 Acknowledgments

- Minimax algorithm concept from classical game theory
- Piece-square table values inspired by chess programming community
- React and Vite for making development smooth and enjoyable

---

**Enjoy playing Chess Attack!  May your moves be strategic and your checkmates swift!  ♟️**

# RetroWin - Windows XP Desktop Experience

A nostalgic recreation of the Windows XP desktop complete with malware mini-game, live chat, and classic applications.

## 🎮 Features

- **Authentic Windows XP Interface** - Pixel-perfect recreation of the classic desktop
- **Malware Mini-Game** - Survive 20 different types of virus popups to access the desktop
- **Live Chat Room** - Real-time chat with other users (localStorage-based for static hosting)
- **Classic Applications** - Notepad, Paint, and more retro apps
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Sound Effects** - Authentic Windows XP sounds and notifications

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Noko7/retro-win.git
cd retro-win
```

2. Start a local server:
```bash
# Using Python (recommended)
python3 -m http.server 3000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:3000
```

3. Open your browser to `http://localhost:3000`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Noko7/retro-win)

**Or manually:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

## 📁 Project Structure

```
retro-win/
├── index.html              # Main page with boot screen, game, and desktop
├── style.css              # Main desktop and UI styling
├── game.css               # Malware game specific styles
├── vercel.json            # Vercel deployment configuration
├── package.json           # Project metadata and scripts
├── public/                # Static assets
│   ├── icons/            # Desktop icons and UI elements
│   ├── music/            # Sound effects and background music
│   └── *.png             # Virus popup images
└── src/                  # JavaScript modules
    ├── chat.js           # Live chat functionality
    ├── desktopIcons.js   # Desktop icon management
    ├── notepad.js        # Notepad application
    ├── paint.js          # Paint application
    ├── popupGame.js      # Malware mini-game logic
    ├── startMenu.js      # Windows XP start menu
    └── windows.js        # Window management system
```

## 🎯 How to Play

1. **Boot Screen** - Click the red "BEGIN" button to start
2. **Malware Game** - Close all virus popups by clicking the X button
   - 20 different virus types with unique behaviors
   - Some popups are harder to close than others
   - Complete the game to access the desktop
3. **Desktop** - Enjoy the Windows XP experience
   - Open applications from the start menu
   - Use the live chat to talk with other users
   - Explore classic Windows applications

## 💻 Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Chat System**: localStorage-based real-time messaging
- **Audio**: Web Audio API for sound effects
- **Responsive**: CSS Grid and Flexbox
- **Hosting**: Optimized for Vercel static deployment

## 🔧 Configuration

### Chat System
The chat uses localStorage for persistence and works across multiple tabs/windows. It's designed specifically for static hosting platforms like Vercel.

### Audio Files
All audio files are in the `public/music/` directory. The game includes:
- Background music during malware game
- Windows XP sound effects
- Chat notification sounds

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: <480px

## 🎨 Customization

### Adding New Virus Types
Edit `src/popupGame.js` and add to the virus types array:

```javascript
{
  name: 'Your Virus Name',
  image: 'public/your-image.png',
  width: 400,
  height: 300,
  message: 'Your virus message'
}
```

### Modifying Chat Features
The chat system in `src/chat.js` can be customized:
- Change polling interval (default: 2 seconds)
- Modify rate limiting (default: 1 second)
- Adjust message limits (default: 100 messages)

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 10+)
- **Mobile browsers**: Responsive design included

## 📝 License

MIT License - feel free to use this project for your own nostalgic creations!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- Chat messages are stored locally (not persistent across different devices)
- Some older browsers may not support Web Audio API
- Mobile experience is optimized but desktop is recommended for full experience

## 🎉 Credits

- Windows XP design inspiration from Microsoft
- Retro styling and nostalgia factor
- Built with love for the early 2000s computing experience

---

**Enjoy your trip back to 2001! 🎮**

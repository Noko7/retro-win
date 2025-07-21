// ===== MALWARE POPUP GAME =====

class MalwareGame {
    constructor() {
        this.gameActive = false;
        this.popups = [];
        this.virusesRemaining = 0;
        this.totalViruses = 0;
        this.gameStartTime = null;
        this.audio = null;
        this.gameTimer = null;
        this.popupSpawnInterval = null;
        
        this.initGame();
    }

    initGame() {
        // Initialize boot screen
        this.setupBootScreen();
        
        // Preload audio
        this.audio = document.getElementById('game-audio');
        if (this.audio) {
            this.audio.volume = 0.6;
        }
    }

    setupBootScreen() {
        const beginButton = document.getElementById('begin-button');
        if (beginButton) {
            beginButton.addEventListener('click', () => {
                this.startGame();
            });
        }
    }

    startGame() {
        console.log('Starting malware game...');
        
        // Hide boot screen
        document.getElementById('boot-screen').style.display = 'none';
        
        // Show game screen
        document.getElementById('game-screen').style.display = 'block';
        
        // Start audio
        if (this.audio) {
            this.audio.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Initialize game state
        this.gameActive = true;
        this.gameStartTime = Date.now();
        this.totalViruses = 20; // Total popups to spawn
        this.virusesRemaining = this.totalViruses;
        this.updateUI();
        
        // Start game timer
        this.startGameTimer();
        
        // Start spawning popups
        this.startPopupSpawning();
        
        // Spawn initial batch
        this.spawnInitialPopups();
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameStartTime) {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('timer').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    startPopupSpawning() {
        // Spawn popups at intervals
        this.popupSpawnInterval = setInterval(() => {
            if (this.gameActive && this.virusesRemaining > 0) {
                this.spawnRandomPopup();
            }
        }, 1500); // Spawn every 1.5 seconds
    }

    spawnInitialPopups() {
        // Spawn 5 initial popups
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.spawnRandomPopup();
            }, i * 500);
        }
    }

    spawnRandomPopup() {
        if (this.virusesRemaining <= 0) return;
        
        const popupTypes = [
            'salineAntivirus',
            'nudeCelebs',
            'ramBooster',
            'toyotaPrize',
            'trojanAlert',
            'billGates',
            'hotViruses',
            'cryptoMiner',
            'chungusToolbar',
            'wormDetected'
        ];
        
        // Special cases
        if (this.virusesRemaining === 1) {
            // Final boss popup
            this.spawnFinalBoss();
            return;
        } else if (this.virusesRemaining <= 3 && Math.random() < 0.3) {
            // Spawn fake task manager
            this.spawnFakeTaskManager();
            return;
        }
        
        const randomType = popupTypes[Math.floor(Math.random() * popupTypes.length)];
        this.spawnPopup(randomType);
    }

    spawnPopup(type) {
        const popup = this.createPopupElement(type);
        this.positionPopup(popup);
        document.getElementById('popup-container').appendChild(popup);
        this.popups.push(popup);
        
        // Add special behaviors
        this.addPopupBehaviors(popup, type);
        
        this.virusesRemaining--;
        this.updateUI();
    }

    createPopupElement(type) {
        const popup = document.createElement('div');
        popup.className = `malware-popup popup-${type}`;
        popup.dataset.type = type;
        
        const popupData = this.getPopupData(type);
        
        // Determine popup and content size based on image
        let contentClass = '';
        let imageClass = '';
        let popupSizeClass = '';
        
        switch(type) {
            case 'ramBooster':
            case 'salineAntivirus':
            case 'local_virus':
                contentClass = 'large-image';
                imageClass = 'large-text';
                popupSizeClass = 'large-popup';
                break;
            case 'billGates':
                contentClass = 'very-large-image';
                imageClass = 'very-large';
                popupSizeClass = 'very-large-popup';
                break;
            case 'censored':
                imageClass = 'small';
                break;
            default:
                // Standard size for other popups
                break;
        }
        
        popup.className = `malware-popup popup-${type} ${popupSizeClass}`;
        popup.dataset.type = type;
        
        popup.innerHTML = `
            <div class="malware-title-bar ${popupData.isVirus ? 'virus-title' : ''}">
                <span>${popupData.title}</span>
                <div class="malware-buttons">
                    <button>_</button>
                    <button>□</button>
                    ${popupData.hasFakeClose ? '<button class="fake-close-btn">✕</button>' : ''}
                    <button class="close-btn" onclick="window.malwareGame.closePopup(this)">✕</button>
                </div>
            </div>
            <div class="malware-content ${contentClass}">
                <img src="${popupData.image}" alt="Virus Image" class="malware-image ${imageClass}" onerror="this.style.display='none'">
                <div class="malware-text ${popupData.isWarning ? 'warning' : ''}">${popupData.content}</div>
                ${popupData.buttons ? popupData.buttons.map(btn => 
                    `<button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">${btn}</button>`
                ).join('') : ''}
            </div>
        `;
        
        if (popupData.isVirus) {
            popup.classList.add('virus-alert');
        }
        
        return popup;
    }

    getPopupData(type) {
        const popupConfigs = {
            salineAntivirus: {
                title: 'Saline Antivirus Alert!',
                content: 'Your PC is infected with 99 viruses! Download now to cleanse!',
                image: 'public/angry-skull.png',
                isVirus: true,
                isWarning: true,
                buttons: ['Download Now!', 'Scan PC'],
                hasFakeClose: true
            },
            nudeCelebs: {
                title: 'Nude Celebs.EXE Detected',
                content: 'Access Hollywood backdoor virus: downloading now... 69% complete',
                image: 'public/censored.png',
                isVirus: true,
                isWarning: false,
                buttons: ['Continue Download', 'Cancel']
            },
            ramBooster: {
                title: 'FREE RAM Booster!',
                content: 'Download now and DOUBLE your memory! Works 100% of the time!',
                image: 'public/free-ram-booster.png',
                isVirus: false,
                isWarning: false,
                buttons: ['Download FREE!', 'Tell a Friend']
            },
            toyotaPrize: {
                title: 'Congratulations!',
                content: "You've won a 1998 Toyota Corolla! Click to claim your rusty prize!",
                image: 'public/toyota-carolla.png',
                isVirus: false,
                isWarning: false,
                buttons: ['Claim Prize!', 'Share with Friends']
            },
            trojanAlert: {
                title: 'System Alert',
                content: 'Trojan.EXE is controlling your mouse! System 32 is now deleted.',
                image: 'public/local_virus.png',
                isVirus: true,
                isWarning: true,
                buttons: ['Fix Now', 'Ignore']
            },
            billGates: {
                title: 'Microsoft Security',
                content: 'Bill Gates is watching you. He does not approve of piracy.',
                image: 'public/bill-gates.png',
                isVirus: true,
                isWarning: true,
                buttons: ['Buy License', 'Hide']
            },
            hotViruses: {
                title: '🔥HOT LOCAL VIRUSES IN YOUR AREA🔥',
                content: 'Download Date.exe to meet them now! Singles in your area want to infect you!',
                image: 'public/local_virus.png',
                isVirus: false,
                isWarning: false,
                buttons: ['Download Date.exe', 'View Profiles']
            },
            cryptoMiner: {
                title: 'Crypto Miner Activated',
                content: "You're mining Dogecoin for strangers! Much virus. Very hack. Wow.",
                image: 'public/chumbus.png',
                isVirus: true,
                isWarning: true,
                buttons: ['Stop Mining', 'Mine More']
            },
            chungusToolbar: {
                title: 'Install Chungus Toolbar?',
                content: 'Set as your homepage forever! Includes 50 search engines you never wanted!',
                image: 'public/chumbus.png',
                isVirus: false,
                isWarning: false,
                buttons: ['Install Now', 'Make Default']
            },
            wormDetected: {
                title: 'WORM_WHOAMI.vbs Detected!',
                content: 'This worm knows your secrets... It has seen your browser history.',
                image: 'public/local_virus.png',
                isVirus: true,
                isWarning: true,
                buttons: ['Delete History', 'Panic']
            }
        };
        
        return popupConfigs[type] || popupConfigs.salineAntivirus;
    }

    spawnFinalBoss() {
        const popup = document.createElement('div');
        popup.className = 'malware-popup popup-final-boss';
        popup.dataset.type = 'finalBoss';
        
        popup.innerHTML = `
            <div class="malware-title-bar virus-title">
                <span>💀 FINAL BOSS VIRUS 💀</span>
                <div class="malware-buttons">
                    <button class="fake-close-btn" onclick="window.malwareGame.fakeButtonClick()">✕</button>
                    <button class="fake-close-btn" onclick="window.malwareGame.fakeButtonClick()">✕</button>
                    <button class="fake-close-btn" onclick="window.malwareGame.fakeButtonClick()">✕</button>
                    <button class="close-btn" onclick="window.malwareGame.closePopup(this)" style="background: #00ff00;">✓</button>
                </div>
            </div>
            <div class="malware-content">
                <img src="public/final_boss.png" alt="Final Boss" class="malware-image" onerror="this.style.display='none'">
                <div class="malware-text warning">
                    I AM THE FINAL VIRUS!<br>
                    YOU CANNOT CLOSE ME!<br>
                    CLICK THE GREEN CHECKMARK TO WIN!
                </div>
                <button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">Delete System32</button>
                <button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">Format Hard Drive</button>
                <button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">Send Nudes to Contacts</button>
            </div>
        `;
        
        // Center the final boss
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '400px';
        popup.style.height = '300px';
        
        document.getElementById('popup-container').appendChild(popup);
        this.popups.push(popup);
        
        this.virusesRemaining--;
        this.updateUI();
    }

    spawnFakeTaskManager() {
        const popup = document.createElement('div');
        popup.className = 'malware-popup fake-task-manager';
        popup.dataset.type = 'fakeTaskManager';
        
        popup.innerHTML = `
            <div class="malware-title-bar">
                <span>Windows Task Manager</span>
                <div class="malware-buttons">
                    <button>_</button>
                    <button>□</button>
                    <button class="close-btn" onclick="window.malwareGame.closePopup(this)">✕</button>
                </div>
            </div>
            <div class="malware-content">
                <div class="task-list">
                    <div class="task-item">virus.exe - 99% CPU</div>
                    <div class="task-item">malware.exe - 87% CPU</div>
                    <div class="task-item">trojan.exe - 76% CPU</div>
                    <div class="task-item">keylogger.exe - 65% CPU</div>
                    <div class="task-item">bitcoin_miner.exe - 54% CPU</div>
                    <div class="task-item">system32_deleter.exe - 43% CPU</div>
                    <div class="task-item">browser_history_leak.exe - 32% CPU</div>
                    <div class="task-item">webcam_spy.exe - 21% CPU</div>
                    <div class="task-item">password_stealer.exe - 10% CPU</div>
                </div>
                <button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">End Task</button>
                <button class="malware-button" onclick="window.malwareGame.fakeButtonClick()">End Process</button>
            </div>
        `;
        
        this.positionPopup(popup);
        document.getElementById('popup-container').appendChild(popup);
        this.popups.push(popup);
        
        this.virusesRemaining--;
        this.updateUI();
    }

    addPopupBehaviors(popup, type) {
        // Add drag behavior
        this.makeDraggable(popup);
        
        // Add special behaviors based on type
        if (type === 'trojanAlert' || type === 'billGates') {
            // These popups move away when hovered
            popup.addEventListener('mouseenter', () => {
                this.movePopupAway(popup);
            });
        }
        
        if (type === 'ramBooster' || type === 'hotViruses') {
            // These popups duplicate when closed
            popup.dataset.duplicates = 'true';
        }
        
        // Add fake close button behavior
        const fakeCloseButtons = popup.querySelectorAll('.fake-close-btn');
        fakeCloseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.fakeButtonClick();
            });
        });
    }

    movePopupAway(popup) {
        if (popup.classList.contains('moving')) return;
        
        popup.classList.add('moving');
        
        const newX = Math.random() * (window.innerWidth - 300);
        const newY = Math.random() * (window.innerHeight - 200);
        
        popup.style.left = newX + 'px';
        popup.style.top = newY + 'px';
        
        setTimeout(() => {
            popup.classList.remove('moving');
        }, 300);
    }

    makeDraggable(popup) {
        const titleBar = popup.querySelector('.malware-title-bar');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = popup.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            popup.style.zIndex = 10001;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                popup.style.left = (e.clientX - dragOffset.x) + 'px';
                popup.style.top = (e.clientY - dragOffset.y) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    positionPopup(popup) {
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 250;
        
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
    }

    closePopup(closeButton) {
        const popup = closeButton.closest('.malware-popup');
        if (!popup) return;
        
        const type = popup.dataset.type;
        
        // Check if this popup duplicates
        if (popup.dataset.duplicates === 'true' && Math.random() < 0.7) {
            // Spawn 2 more popups
            setTimeout(() => this.spawnRandomPopup(), 100);
            setTimeout(() => this.spawnRandomPopup(), 200);
        }
        
        // Remove popup
        popup.remove();
        this.popups = this.popups.filter(p => p !== popup);
        
        // Play error sound for some popups
        if (type === 'fakeTaskManager' || type === 'trojanAlert') {
            this.playErrorSound();
        }
        
        // Check win condition
        if (this.popups.length === 0 && this.virusesRemaining <= 0) {
            this.gameWon();
        }
    }

    fakeButtonClick() {
        // Play error sound
        this.playErrorSound();
        
        // Spawn additional popup
        if (Math.random() < 0.5) {
            setTimeout(() => this.spawnRandomPopup(), 500);
        }
        
        // Show fake alert
        setTimeout(() => {
            alert('Error: Operation failed successfully!');
        }, 100);
    }

    playErrorSound() {
        // Create a simple error sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Error sound failed:', e);
        }
    }

    updateUI() {
        document.getElementById('virus-count').textContent = this.popups.length;
    }

    gameWon() {
        console.log('Game won!');
        this.gameActive = false;
        
        // Stop intervals
        clearInterval(this.gameTimer);
        clearInterval(this.popupSpawnInterval);
        
        // Stop audio
        if (this.audio) {
            this.audio.pause();
        }
        
        // Show success screen
        this.showSuccessScreen();
    }

    showSuccessScreen() {
        const endTime = Date.now();
        const gameTime = Math.floor((endTime - this.gameStartTime) / 1000);
        
        // Mark original game as completed
        localStorage.setItem('original_malware_completed', 'true');
        
        const successScreen = document.createElement('div');
        successScreen.className = 'game-complete';
        successScreen.innerHTML = `
            <div>
                <h1>CONGRATULATIONS!</h1>
                <p>You have successfully defeated all the viruses!</p>
                <p>Time: ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}</p>
                <p>Your system is now clean... or is it?</p>
                <p style="color: #ffff00; font-weight: bold; margin-top: 20px;">
                    🔍 CASE FILES UNLOCKED! 🔍
                </p>
                <p>New investigation protocols are now available...</p>
                <p>Click anywhere to continue...</p>
            </div>
        `;
        
        document.body.appendChild(successScreen);
        
        successScreen.addEventListener('click', () => {
            successScreen.remove();
            document.getElementById('game-screen').style.display = 'none';
            
            // Complete Level 1 in progression system if it exists
            if (window.gameProgression) {
                const gameStats = {
                    time: gameTime,
                    virusesDefeated: this.totalViruses,
                    perfect: gameTime <= 60,
                    hintsUsed: 0
                };
                
                // Handle first-time completion (auto-complete level 1, unlock level 2)
                window.gameProgression.handleFirstTimeCompletion(gameStats);
                
                // Show progression system after a brief delay
                setTimeout(() => {
                    window.gameProgression.showLevelSelection();
                }, 1000);
            } else {
                // Fallback to desktop if progression system isn't loaded
                document.getElementById('main-desktop').style.display = 'block';
                // Show game access panel after 3 seconds delay
                setTimeout(() => {
                    const questPanel = document.getElementById('game-access-panel');
                    if (questPanel) {
                        questPanel.style.display = 'block';
                    }
                }, 3000);
            }
            
            // Dispatch completion event for any other listeners
            window.dispatchEvent(new CustomEvent('malwareGameComplete', { 
                detail: {
                    time: gameTime,
                    virusesDefeated: this.totalViruses,
                    perfect: gameTime <= 60,
                    hintsUsed: 0
                }
            }));
        });
    }

    // Method to start level mode for progression system
    startLevelMode(levelConfig) {
        console.log('Starting level mode:', levelConfig.name);
        
        // Configure game based on level
        this.totalViruses = levelConfig.virusCount || 20;
        this.virusesRemaining = this.totalViruses;
        
        // Start the basic popup game with level parameters
        this.startGame();
    }

    resetGame() {
        // Reset game state
        this.gameActive = false;
        this.popups.forEach(popup => popup.remove());
        this.popups = [];
        this.virusesRemaining = 0;
        this.totalViruses = 0;
        
        // Clear intervals
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.popupSpawnInterval) clearInterval(this.popupSpawnInterval);
        
        // Stop audio
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        
        // Hide all screens
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('main-desktop').style.display = 'none';
        document.getElementById('game-access-panel').style.display = 'none';
        
        // Show boot screen
        document.getElementById('boot-screen').style.display = 'block';
    }

    resetGame() {
        // Reset game state
        this.gameActive = false;
        this.popups = [];
        this.virusesRemaining = 0;
        this.totalViruses = 0;
        this.gameStartTime = null;
        
        // Clear intervals
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.popupSpawnInterval) clearInterval(this.popupSpawnInterval);
        
        // Stop audio
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        
        // Clear popup container
        const container = document.getElementById('popup-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Hide game access panel
        document.getElementById('game-access-panel').style.display = 'none';
        
        // Show boot screen
        document.getElementById('main-desktop').style.display = 'none';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('boot-screen').style.display = 'flex';
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.malwareGame = new MalwareGame();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.malwareGame) {
            window.malwareGame = new MalwareGame();
        }
    });
} else {
    if (!window.malwareGame) {
        window.malwareGame = new MalwareGame();
    }
}

// Global restart function
window.restartMalwareGame = function() {
    if (window.malwareGame) {
        window.malwareGame.resetGame();
    }
};

class StartMenu {
    constructor() {
        console.log('StartMenu initialized');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Start Menu');
        this.menuElement = this.createMenu();
        this.isOpen = false;
        this.initEvents();
    }

    createMenu() {
        // Remove any existing menu
        const existingMenu = document.getElementById('start-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.id = 'start-menu';
        menu.style.display = 'none';
        menu.innerHTML = `
            <div class="xp-menu">
                <div class="xp-menu-left">
                    <div class="xp-menu-logo">
                        <span class="xp-menu-label">Windows XP</span>
                    </div>
                    <div class="xp-menu-user">
                        <img src="public/icons/Xp-Basic-Windows-Magnifier.256.png" alt="User" class="xp-user-icon">
                        <span class="xp-user-name">RetroWin User</span>
                    </div>
                    <div class="xp-menu-list">
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('internet')">
                            <img src="public/icons/network.png" alt="Internet" class="xp-menu-icon">
                            <span>Internet</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('email')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="E-mail" class="xp-menu-icon">
                            <span>E-mail</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('projects')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="My Projects" class="xp-menu-icon">
                            <span>My Projects</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('documents')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="My Documents" class="xp-menu-icon">
                            <span>My Documents</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('pictures')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="My Pictures" class="xp-menu-icon">
                            <span>My Pictures</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('music')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="My Music" class="xp-menu-icon">
                            <span>My Music</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('computer')">
                            <img src="public/icons/Hopstarter-Mac-Folders-Windows.256.png" alt="My Computer" class="xp-menu-icon">
                            <span>My Computer</span>
                        </div>
                        <div class="xp-menu-item" onclick="window.startMenu.openApp('control')">
                            <img src="public/icons/Xp-Basic-Windows-Magnifier.256.png" alt="Control Panel" class="xp-menu-icon">
                            <span>Control Panel</span>
                        </div>
                    </div>
                </div>
                <div class="xp-menu-right">
                    <div class="xp-menu-search">
                        <input type="text" class="xp-search" placeholder="Search...">
                    </div>
                    <div class="xp-menu-item" onclick="window.startMenu.openApp('run')">
                        <span>Run...</span>
                    </div>
                    <div class="xp-menu-item" onclick="window.startMenu.openApp('help')">
                        <span>Help and Support</span>
                    </div>
                    <button class="xp-menu-shutdown" onclick="window.startMenu.openApp('shutdown')">
                        <img src="public/icons/recycle-bin.png" alt="Shut Down">
                        <span>Turn Off Computer</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(menu);
        return menu;
    }

    initEvents() {
        const startBtn = document.getElementById('start-button');
        console.log('Start button found:', startBtn !== null);

        if (startBtn) {
            // Remove any existing listeners
            startBtn.onclick = null;
            
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start button clicked, current state:', this.isOpen);
                this.toggleMenu();
            });
        }

        // Document click handler to close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !e.target.closest('#start-button') && 
                !e.target.closest('#start-menu')) {
                console.log('Clicking outside, closing menu');
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        console.log('Toggling menu, current state:', this.isOpen);
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        console.log('Opening menu');
        if (this.menuElement) {
            this.menuElement.style.display = 'block';
            this.isOpen = true;
        } else {
            console.error('Menu element not found');
        }
    }

    closeMenu() {
        console.log('Closing menu');
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
            this.isOpen = false;
        }
    }

    openApp(appName) {
        console.log('Opening app:', appName);
        
        switch(appName) {
            case 'projects':
                window.open('https://github.com/Noko7', '_blank');
                break;
            case 'internet':
                window.open('https://www.google.com', '_blank');
                break;
            case 'email':
                window.open('mailto:', '_blank');
                break;
            case 'computer':
                // Show the My Computer window
                const computerWindow = document.querySelector('.window');
                if (computerWindow) {
                    computerWindow.style.display = 'block';
                }
                break;
            case 'shutdown':
                if (confirm('Are you sure you want to turn off the computer?')) {
                    alert('Computer shutting down... (just kidding!)');
                }
                break;
            case 'run':
                const command = prompt('Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.');
                if (command) {
                    alert(`Running: ${command}... (simulation)`);
                }
                break;
            case 'help':
                alert('We live in a simulation, so help is limited!');
                break;
            default:
                alert(`Opening ${appName}... (simulation)`);
        }
        
        this.closeMenu();
    }
}

export default StartMenu;
class StartMenu {
    constructor() {
        console.log("StartMenu initialized");
        this.menuElement = this.createMenu();
        this.isOpen = false;
        this.initEvents();
    }

    createMenu() {
        const menu = document.createElement('div');
        menu.id = 'start-menu';
        menu.style.display = 'none';
        menu.innerHTML = `
            <div class="vista7-menu">
                <div class="vista7-left">
                    <div class="vista7-user">
                        <img src="public/icons/user.png" class="vista7-user-icon" alt="User" />
                        <span class="vista7-user-name">Noko</span>
                    </div>
                    <div class="vista7-menu-list">
                        <div class="vista7-menu-item" data-app="about">
                            <img src="public/icons/about.png" class="vista7-menu-icon" /> About
                        </div>
                        <div class="vista7-menu-item" data-app="projects">
                            <img src="public/icons/projects.png" class="vista7-menu-icon" /> Projects
                        </div>
                        <div class="vista7-menu-item" data-app="contact">
                            <img src="public/icons/contact.png" class="vista7-menu-icon" /> Contact
                        </div>
                    </div>
                </div>
                <div class="vista7-right">
                    <div class="vista7-link">Documents</div>
                    <div class="vista7-link">Pictures</div>
                    <div class="vista7-link">Computer</div>
                    <div class="vista7-link">Control Panel</div>
                </div>
                <div class="vista7-bottom">
                    <input class="vista7-search" type="text" placeholder="Search programs and files" />
                    <button class="vista7-shutdown">
                        <img src="public/icons/shutdown.png" alt="Shutdown" />
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
        return menu;
    }

    initEvents() {
        const startBtn = document.getElementById('start-button');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Menu item click
        this.menuElement.addEventListener('click', (event) => {
            const item = event.target.closest('.vista7-menu-item');
            if (item) {
                this.openApp(item.dataset.app);
            }
        });

        // Shutdown button click
        this.menuElement.querySelector('.vista7-shutdown').addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Shutting down...');
            this.closeMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.menuElement.contains(event.target) && event.target.id !== 'start-button') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        // Position menu above the start button
        const startBtn = document.getElementById('start-button');
        if (startBtn) {
            const rect = startBtn.getBoundingClientRect();
            this.menuElement.style.position = 'fixed';
            this.menuElement.style.left = rect.left + 'px';
            this.menuElement.style.bottom = '50px'; // Adjust as needed for your taskbar height
        }
        this.menuElement.style.display = 'block';
        this.isOpen = true;
    }

    closeMenu() {
        this.menuElement.style.display = 'none';
        this.isOpen = false;
    }

    openApp(appName) {
        if (appName === 'projects') {
            window.open('https://github.com/Noko7', '_blank');
        } else {
            alert(`Opening ${appName}...`);
        }
        this.closeMenu();
    }
}

export default StartMenu;
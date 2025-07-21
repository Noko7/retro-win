// ===== NOTEPAD APPLICATION =====

class Notepad {
    constructor() {
        this.currentFile = null;
        this.isModified = false;
        this.content = '';
        this.isMaximized = false;
        this.originalSize = { width: 600, height: 450, top: 100, left: 300 };
        
        this.initNotepad();
    }

    initNotepad() {
        const textarea = document.getElementById('notepad-textarea');
        if (textarea) {
            // Track changes
            textarea.addEventListener('input', () => {
                this.isModified = true;
                this.updateTitle();
                this.updateStatus();
                this.updatePosition();
            });

            // Track cursor position
            textarea.addEventListener('selectionchange', () => {
                this.updatePosition();
            });

            textarea.addEventListener('keyup', () => {
                this.updatePosition();
            });

            textarea.addEventListener('click', () => {
                this.updatePosition();
            });

            // Keyboard shortcuts
            textarea.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    switch(e.key) {
                        case 'n':
                            e.preventDefault();
                            this.newFile();
                            break;
                        case 's':
                            e.preventDefault();
                            this.saveFile();
                            break;
                        case 'o':
                            e.preventDefault();
                            this.openFile();
                            break;
                        case 'p':
                            e.preventDefault();
                            this.printFile();
                            break;
                    }
                }
            });
        }

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notepad-menu-bar')) {
                this.closeAllMenus();
            }
        });
    }

    updateTitle() {
        const titleElement = document.querySelector('.notepad-window .title');
        if (titleElement) {
            const fileName = this.currentFile || 'Untitled';
            const modified = this.isModified ? '*' : '';
            titleElement.textContent = `${modified}${fileName} - Notepad`;
        }
    }

    updateStatus() {
        const statusElement = document.getElementById('notepad-status');
        if (statusElement) {
            statusElement.textContent = this.isModified ? 'Modified' : 'Ready';
        }
    }

    updatePosition() {
        const textarea = document.getElementById('notepad-textarea');
        const positionElement = document.getElementById('notepad-position');
        
        if (textarea && positionElement) {
            const text = textarea.value;
            const cursorPos = textarea.selectionStart;
            
            // Calculate line and column
            const lines = text.substring(0, cursorPos).split('\n');
            const line = lines.length;
            const col = lines[lines.length - 1].length + 1;
            
            positionElement.textContent = `Ln ${line}, Col ${col}`;
        }
    }

    closeAllMenus() {
        const menus = document.querySelectorAll('.notepad-dropdown-menu');
        menus.forEach(menu => menu.style.display = 'none');
    }
}

// Notepad Functions
function openNotepad() {
    const notepadWindow = document.querySelector('.notepad-window');
    if (notepadWindow) {
        notepadWindow.style.display = 'block';
        notepadWindow.style.zIndex = getHighestZIndex() + 1;
        
        // Focus on textarea
        const textarea = document.getElementById('notepad-textarea');
        if (textarea) {
            setTimeout(() => textarea.focus(), 100);
        }
    }
}

function closeNotepad() {
    const notepad = window.notepadApp;
    if (notepad && notepad.isModified) {
        if (confirm('Do you want to save changes to Untitled?')) {
            notepad.saveFile();
        }
    }
    
    const notepadWindow = document.querySelector('.notepad-window');
    if (notepadWindow) {
        notepadWindow.style.display = 'none';
    }
}

function minimizeNotepad() {
    const notepadWindow = document.querySelector('.notepad-window');
    if (notepadWindow) {
        notepadWindow.style.display = 'none';
        // In a real implementation, this would minimize to taskbar
        alert('Notepad minimized (simulation)');
    }
}

function maximizeNotepad() {
    const notepadWindow = document.querySelector('.notepad-window');
    const notepad = window.notepadApp;
    
    if (notepadWindow && notepad) {
        if (!notepad.isMaximized) {
            // Store original size
            notepad.originalSize = {
                width: parseInt(notepadWindow.style.width) || 600,
                height: parseInt(notepadWindow.style.height) || 450,
                top: parseInt(notepadWindow.style.top) || 100,
                left: parseInt(notepadWindow.style.left) || 300
            };
            
            // Maximize
            notepadWindow.style.width = '100vw';
            notepadWindow.style.height = 'calc(100vh - 30px)';
            notepadWindow.style.top = '0';
            notepadWindow.style.left = '0';
            notepad.isMaximized = true;
        } else {
            // Restore
            notepadWindow.style.width = notepad.originalSize.width + 'px';
            notepadWindow.style.height = notepad.originalSize.height + 'px';
            notepadWindow.style.top = notepad.originalSize.top + 'px';
            notepadWindow.style.left = notepad.originalSize.left + 'px';
            notepad.isMaximized = false;
        }
    }
}

// Menu Functions
function toggleFileMenu() {
    const fileMenu = document.getElementById('file-menu');
    const isVisible = fileMenu.style.display === 'block';
    
    // Close all menus first
    window.notepadApp.closeAllMenus();
    
    if (!isVisible) {
        fileMenu.style.display = 'block';
    }
}

function toggleEditMenu() {
    window.notepadApp.closeAllMenus();
    alert('Edit menu (simulation)');
}

function toggleFormatMenu() {
    window.notepadApp.closeAllMenus();
    alert('Format menu (simulation)');
}

function toggleViewMenu() {
    window.notepadApp.closeAllMenus();
    alert('View menu (simulation)');
}

function toggleHelpMenu() {
    window.notepadApp.closeAllMenus();
    alert('Help menu (simulation)');
}

// File Operations
function newFile() {
    const notepad = window.notepadApp;
    if (notepad && notepad.isModified) {
        if (!confirm('Do you want to save changes to the current document?')) {
            return;
        }
    }
    
    const textarea = document.getElementById('notepad-textarea');
    if (textarea) {
        textarea.value = '';
        notepad.currentFile = null;
        notepad.isModified = false;
        notepad.updateTitle();
        notepad.updateStatus();
        notepad.updatePosition();
        textarea.focus();
    }
    
    notepad.closeAllMenus();
}

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.html,.css,.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const textarea = document.getElementById('notepad-textarea');
                const notepad = window.notepadApp;
                
                if (textarea && notepad) {
                    textarea.value = e.target.result;
                    notepad.currentFile = file.name;
                    notepad.isModified = false;
                    notepad.updateTitle();
                    notepad.updateStatus();
                    notepad.updatePosition();
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
    window.notepadApp.closeAllMenus();
}

function saveFile() {
    const textarea = document.getElementById('notepad-textarea');
    const notepad = window.notepadApp;
    
    if (textarea && notepad) {
        const content = textarea.value;
        const fileName = notepad.currentFile || 'untitled.txt';
        
        // Create download link
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        
        notepad.isModified = false;
        notepad.updateTitle();
        notepad.updateStatus();
    }
    
    window.notepadApp.closeAllMenus();
}

function saveAsFile() {
    const textarea = document.getElementById('notepad-textarea');
    const notepad = window.notepadApp;
    
    if (textarea && notepad) {
        const fileName = prompt('Enter filename:', notepad.currentFile || 'untitled.txt');
        if (fileName) {
            notepad.currentFile = fileName;
            saveFile();
        }
    }
    
    window.notepadApp.closeAllMenus();
}

function pageSetup() {
    alert('Page Setup dialog (simulation)');
    window.notepadApp.closeAllMenus();
}

function printFile() {
    const textarea = document.getElementById('notepad-textarea');
    if (textarea) {
        const content = textarea.value;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head><title>Print - Notepad</title></head>
            <body style="font-family: 'Courier New', monospace; white-space: pre-wrap; font-size: 12px;">
            ${content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    window.notepadApp.closeAllMenus();
}

// Utility function
function getHighestZIndex() {
    const elements = document.querySelectorAll('.window, .popup-window');
    let highest = 10;
    
    elements.forEach(el => {
        const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
        if (zIndex > highest) {
            highest = zIndex;
        }
    });
    
    return highest;
}

// Initialize Notepad when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.notepadApp = new Notepad();
});

// Global function to open notepad from desktop icon
window.openNotepadApp = function() {
    openNotepad();
};

// ===== FILE INVESTIGATION MINI-GAMES =====

class FileInvestigationSystem {
    constructor() {
        this.currentFiles = [];
        this.solvedPuzzles = [];
        this.evidenceCollected = [];
        this.level = null;
        this.gameInterface = null;
    }

    initLevel(level) {
        this.level = level;
        this.level.startTime = Date.now();
        this.currentFiles = [...level.files];
        this.solvedPuzzles = [];
        this.evidenceCollected = [];
        this.createFileInvestigationInterface();
    }

    createFileInvestigationInterface() {
        // Remove any existing interfaces
        const existing = document.getElementById('file-investigation-game');
        if (existing) existing.remove();

        const gameHTML = `
            <div id="file-investigation-game" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: url('public/icons/xp-wallpaper.jpg') center/cover;
                z-index: 9999;
                overflow: hidden;
            ">
                <div style="padding: 20px; color: white; background: rgba(0,0,0,0.8); margin: 20px; border-radius: 8px;">
                    <h2>${this.level.name}</h2>
                    <p>${this.level.storyText}</p>
                    <div id="investigation-objectives">
                        <h4>Objectives:</h4>
                        <ul>
                            ${this.level.objectives.map(obj => `<li id="obj-${obj.replace(/\s+/g, '-').toLowerCase()}">${obj}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 10px;">
                        <span>Evidence Collected: <span id="evidence-count">${this.evidenceCollected.length}</span>/3</span> |
                        <span>Time: <span id="investigation-timer">00:00</span></span>
                    </div>
                </div>
                
                <div class="window draggable" style="top: 150px; left: 200px; width: 600px; height: 400px;">
                    <div class="title-bar">
                        <span class="title">🔍 Digital Forensics Explorer</span>
                        <span class="window-buttons">
                            <button onclick="fileInvestigation.exitLevel()">X</button>
                        </span>
                    </div>
                    <div class="window-content" style="height: calc(100% - 28px); overflow-y: auto;">
                        <div id="file-explorer-content">
                            ${this.generateFileExplorerContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameHTML);
        this.startInvestigationTimer();
        this.initFileExplorerInteractions();
    }

    startInvestigationTimer() {
        this.timerInterval = setInterval(() => {
            if (this.level && this.level.startTime) {
                const elapsed = Math.floor((Date.now() - this.level.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                const timerElement = document.getElementById('investigation-timer');
                if (timerElement) {
                    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                
                // Check time limit
                if (elapsed >= this.level.timeLimit) {
                    this.timeLimitReached();
                }
            }
        }, 1000);
    }

    timeLimitReached() {
        clearInterval(this.timerInterval);
        alert('Time limit reached! Investigation failed.');
        this.exitLevel();
    }

    generateFileExplorerContent() {
        return this.level.files.map(file => {
            const icon = this.getFileIcon(file.type);
            const status = file.corrupted ? '⚠️ CORRUPTED' : file.encrypted ? '🔒 ENCRYPTED' : file.hidden ? '👻 HIDDEN' : '📄 NORMAL';
            
            return `
                <div class="file-item" data-filename="${file.name}" style="
                    display: flex; align-items: center; padding: 8px; 
                    border-bottom: 1px solid #ddd; cursor: pointer;
                    transition: background-color 0.2s;
                " onclick="fileInvestigation.investigateFile('${file.name}', '${file.type}')" 
                   onmouseover="this.style.backgroundColor='#e6f3ff'" 
                   onmouseout="this.style.backgroundColor='transparent'">
                    <span style="margin-right: 10px; font-size: 20px;">${icon}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${file.name}</div>
                        <div style="font-size: 12px; color: #666;">${status}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    initFileExplorerInteractions() {
        // Add any additional interactive elements here
        console.log('File investigation interface initialized');
    }

    investigateFile(filename, type) {
        const file = this.currentFiles.find(f => f.name === filename);
        if (!file) return;

        // Close any existing modal
        this.closeModal();

        switch (file.type) {
            case 'evidence':
                this.openEvidenceFile(file);
                break;
            case 'repair':
                this.openRepairTool(file);
                break;
            case 'analysis':
                this.openAnalysisTool(file);
                break;
            default:
                this.openGenericFile(file);
        }
    }

    openEvidenceFile(file) {
        const content = this.getEvidenceContent(file.name);
        
        const modal = this.createModal(`📋 Evidence: ${file.name}`, `
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; white-space: pre-wrap; max-height: 300px; overflow-y: auto;">
${content}
            </div>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="fileInvestigation.collectEvidence('${file.name}')" style="
                    background: #4CAF50; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer; margin-right: 10px;
                ">Collect Evidence</button>
                <button onclick="fileInvestigation.closeModal()" style="
                    background: #666; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer;
                ">Close</button>
            </div>
        `);
    }

    openRepairTool(file) {
        if (file.corrupted) {
            this.showCorruptedFileRepair(file);
        } else {
            this.openGenericFile(file);
        }
    }

    showCorruptedFileRepair(file) {
        const puzzleData = this.generateRepairPuzzle();
        
        const modal = this.createModal(`🔧 Repair: ${file.name}`, `
            <div style="margin-bottom: 15px;">
                <p style="color: #d32f2f;">⚠️ File is corrupted! Restore the missing data to repair it.</p>
            </div>
            
            <div style="background: #1a1a1a; color: #00ff00; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                <div style="margin-bottom: 10px;">Corrupted Registry Entry:</div>
                <div id="corruption-puzzle">${puzzleData.corrupted}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Missing Characters:</label>
                <input type="text" id="repair-input" placeholder="Enter missing characters..." style="
                    width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;
                    font-family: 'Courier New', monospace;
                ">
            </div>
            
            <div style="text-align: center;">
                <button onclick="fileInvestigation.attemptRepair('${file.name}', '${puzzleData.solution}')" style="
                    background: #2196F3; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer; margin-right: 10px;
                ">Attempt Repair</button>
                <button onclick="fileInvestigation.closeModal()" style="
                    background: #666; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer;
                ">Cancel</button>
            </div>
        `);
    }

    generateRepairPuzzle() {
        const puzzles = [
            {
                corrupted: 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\n"vDemon"="C:\\System32\\???.exe"',
                solution: 'virus',
                hint: 'What type of malicious software is vDemon?'
            },
            {
                corrupted: 'Network Connection: 192.168.1.??? -> Command Server',
                solution: '666',
                hint: 'What IP address would a demon use?'
            },
            {
                corrupted: 'Process Name: vDemon.exe\nParent Process: ???.exe\nStatus: Running',
                solution: 'explorer',
                hint: 'What legitimate Windows process would a virus hijack?'
            }
        ];
        
        return puzzles[Math.floor(Math.random() * puzzles.length)];
    }

    attemptRepair(filename, solution) {
        const userInput = document.getElementById('repair-input').value.toLowerCase().trim();
        
        if (userInput === solution.toLowerCase()) {
            // Success
            const file = this.currentFiles.find(f => f.name === filename);
            file.corrupted = false;
            this.solvedPuzzles.push(filename);
            
            this.closeModal();
            this.showSuccess(`✅ ${filename} successfully repaired!`);
            this.checkLevelCompletion();
        } else {
            // Failure
            this.showError('❌ Incorrect! Try again.');
        }
    }

    openAnalysisTool(file) {
        const analysisData = this.generateAnalysisTask(file.name);
        
        const modal = this.createModal(`🔬 Analysis: ${file.name}`, `
            <div style="margin-bottom: 15px;">
                <p>Analyze the virus signature pattern below:</p>
            </div>
            
            <div style="background: #1a1a1a; color: #00ff00; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                <div style="margin-bottom: 10px;">Hex Signature:</div>
                <div style="font-size: 12px; line-height: 1.6;">${analysisData.hexData}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p>Question: ${analysisData.question}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    ${analysisData.options.map((option, index) => 
                        `<button onclick="fileInvestigation.selectAnalysisAnswer('${file.name}', ${index}, ${analysisData.correct})" 
                                style="padding: 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #f9f9f9;">
                            ${option}
                         </button>`
                    ).join('')}
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="fileInvestigation.closeModal()" style="
                    background: #666; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer;
                ">Cancel</button>
            </div>
        `);
    }

    generateAnalysisTask(filename) {
        const tasks = [
            {
                hexData: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00\nB8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00\nvDEMON_PAYLOAD_START_HERE_666',
                question: 'What type of executable format is this?',
                options: ['PE (Windows)', 'ELF (Linux)', 'Mach-O (macOS)', 'Java Bytecode'],
                correct: 0
            },
            {
                hexData: 'GET /command?id=vdemon&action=download HTTP/1.1\nHost: evil-command-server.dark\nUser-Agent: vDemon/1.0',
                question: 'What is this virus attempting to do?',
                options: ['Send spam email', 'Download additional payloads', 'Mine cryptocurrency', 'Delete system files'],
                correct: 1
            },
            {
                hexData: 'RegSetValueEx(HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", "vDemon", REG_SZ, "C:\\System32\\virus.exe")',
                question: 'What persistence method is being used?',
                options: ['Service installation', 'Startup registry entry', 'Task scheduler', 'DLL injection'],
                correct: 1
            }
        ];
        
        return tasks[Math.floor(Math.random() * tasks.length)];
    }

    selectAnalysisAnswer(filename, selected, correct) {
        if (selected === correct) {
            const file = this.currentFiles.find(f => f.name === filename);
            if (file.hidden) file.hidden = false;
            this.solvedPuzzles.push(filename);
            
            this.closeModal();
            this.showSuccess(`✅ Correct analysis! ${filename} decoded.`);
            this.checkLevelCompletion();
        } else {
            this.showError('❌ Incorrect analysis. Try again!');
        }
    }

    collectEvidence(filename) {
        if (!this.evidenceCollected.includes(filename)) {
            this.evidenceCollected.push(filename);
            this.showSuccess(`📋 Evidence collected: ${filename}`);
        }
        this.closeModal();
        this.checkLevelCompletion();
    }

    getEvidenceContent(filename) {
        const evidence = {
            'system_log_1.txt': `[2024-01-15 14:32:17] System startup initiated
[2024-01-15 14:32:45] Network adapter initialized
[2024-01-15 14:33:02] ⚠️  Unusual process detected: vdemon.exe
[2024-01-15 14:33:02] ⚠️  Process parent: explorer.exe
[2024-01-15 14:33:03] ⚠️  Network connection established: 192.168.1.666
[2024-01-15 14:33:05] ⚠️  Registry modification detected
[2024-01-15 14:33:07] System performance degraded
[2024-01-15 14:33:10] Multiple popup windows spawned
[2024-01-15 14:33:15] ⚠️  Unusual memory allocation pattern
[2024-01-15 14:33:20] User input monitoring suspected`,

            'network_trace.log': `[ENCRYPTED - Use decryption key: VIRUS]
Connection trace:
Source: 192.168.1.100 (Your PC)
Destination: 192.168.1.666 (Command Server)
Protocol: HTTP
Data: Command payload requests
Frequency: Every 30 seconds
Status: ACTIVE THREAT`,

            'virus_def.dat': `Virus Signature Database Entry:
Name: vDemon
Type: Polymorphic Trojan
Threat Level: Critical
Behavior: 
- Registry persistence
- Network communication
- Process injection
- Memory manipulation
- User interface hijacking
MD5: d41d8cd98f00b204e9800998ecf8427e
First seen: Unknown
Last seen: Current session`
        };
        
        return evidence[filename] || 'No content available for this file.';
    }

    checkLevelCompletion() {
        if (!this.level) return;
        
        const requiredEvidence = this.level.files.filter(f => f.type === 'evidence').length;
        const requiredRepairs = this.level.files.filter(f => f.type === 'repair').length;
        const requiredAnalysis = this.level.files.filter(f => f.type === 'analysis').length;
        
        const evidenceCompleted = this.evidenceCollected.length;
        const puzzlesCompleted = this.solvedPuzzles.length;
        
        if (evidenceCompleted >= requiredEvidence && puzzlesCompleted >= (requiredRepairs + requiredAnalysis)) {
            this.completeLevelInvestigation();
        }
    }

    completeLevelInvestigation() {
        // Calculate completion stats
        const stats = {
            time: Math.floor((Date.now() - this.level.startTime) / 1000),
            evidenceCollected: this.evidenceCollected.length,
            puzzlesSolved: this.solvedPuzzles.length,
            perfect: this.evidenceCollected.length === this.level.files.length,
            hintsUsed: 0
        };
        
        // Complete the level in progression system
        if (window.gameProgression) {
            window.gameProgression.completeLevel(this.level.id, stats);
        }
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.id = 'investigation-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white; border-radius: 8px; padding: 20px; 
                max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <h3 style="margin-top: 0; color: #2c3e50;">${title}</h3>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    closeModal() {
        const modal = document.getElementById('investigation-modal');
        if (modal) modal.remove();
    }

    showSuccess(message) {
        this.showNotification(message, '#4CAF50');
    }

    showError(message) {
        this.showNotification(message, '#f44336');
    }

    showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10001;
            background: ${color}; color: white; padding: 12px 20px;
            border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-family: Tahoma, sans-serif; font-size: 14px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getFileIcon(type) {
        const icons = {
            evidence: '📋',
            repair: '🔧',
            analysis: '🔬',
            log: '📊'
        };
        return icons[type] || '📄';
    }

    openGenericFile(file) {
        const modal = this.createModal(`📄 ${file.name}`, `
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace;">
                This file appears to be a standard ${file.type} file.
                <br><br>
                No special investigation tools are needed for this file type.
            </div>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="fileInvestigation.closeModal()" style="
                    background: #666; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; cursor: pointer;
                ">Close</button>
            </div>
        `);
    }

    exitLevel() {
        // Clean up timers
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove game interface
        const gameScreen = document.getElementById('file-investigation-game');
        if (gameScreen) gameScreen.remove();
        
        // Close any open modals
        this.closeModal();
        
        // Return to level selection
        if (window.gameProgression) {
            window.gameProgression.showLevelSelection();
        }
    }
}

// Initialize file investigation system
window.fileInvestigation = new FileInvestigationSystem();

// ===== FILE INVESTIGATION MINI-GAMES =====

class FileInvestigationSystem {
    constructor() {
        this.currentFiles = [];
        this.solvedPuzzles = [];
        this.evidenceCollected = [];
        this.repairedFiles = [];
        this.analysisCompleted = [];
        this.level = null;
        this.gameInterface = null;
    }

    initLevel(level) {
        this.level = level;
        this.level.startTime = Date.now();
        this.currentFiles = [...level.files];
        this.solvedPuzzles = [];
        this.evidenceCollected = [];
        this.repairedFiles = [];
        this.analysisCompleted = [];
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
                <!-- Progress Panel - Compact top right position -->
                <div id="progress-panel" style="
                    position: fixed; top: 20px; right: 20px; 
                    background: rgba(0,0,0,0.9); color: white; 
                    padding: 12px; border-radius: 6px; min-width: 280px; max-width: 320px;
                    border: 2px solid #4CAF50; font-family: Tahoma, sans-serif;
                    z-index: 10005; font-size: 11px;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #4CAF50;">🔍 ${this.level.name}</h3>
                    <div style="font-size: 12px; margin-bottom: 15px; line-height: 1.4;">
                        ${this.level.storyText}
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 14px;">Progress Checklist:</h4>
                        <div id="progress-checklist">
                            ${this.generateProgressChecklist()}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                        <div>📋 Evidence: <span id="evidence-count">${this.evidenceCollected.length}</span>/${this.level.files.filter(f => f.type === 'evidence').length}</div>
                        <div>🔧 Repairs: <span id="repair-count">0</span>/${this.level.files.filter(f => f.type === 'repair').length}</div>
                        <div>🔬 Analysis: <span id="analysis-count">0</span>/${this.level.files.filter(f => f.type === 'analysis').length}</div>
                        <div>⏱️ Time: <span id="investigation-timer">00:00</span></div>
                    </div>
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
                        <div style="font-size: 12px; text-align: center;">
                            Overall Progress: <span id="overall-progress">0</span>%
                        </div>
                        <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; margin-top: 5px;">
                            <div id="progress-bar" style="background: #4CAF50; height: 100%; border-radius: 3px; width: 0%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Main File Explorer Window - Simple desktop window style -->
                <div class="window" id="file-explorer-window" style="
                    position: fixed;
                    top: 80px; 
                    left: 20px; 
                    width: 550px; 
                    height: 500px;
                    z-index: 10000;
                ">
                    <div class="title-bar">
                        <span class="title">🔍 Digital Forensics Explorer</span>
                        <span class="window-buttons">
                            <button onclick="fileInvestigation.minimizeWindow()">_</button>
                            <button onclick="fileInvestigation.exitLevel()">X</button>
                        </span>
                    </div>
                    <div class="window-content" style="
                        height: calc(100% - 28px); 
                        overflow-y: auto; 
                        padding: 8px;
                        background: #c0c0c0;
                    ">
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
        this.updateProgress();
        
        // Make the file explorer window draggable using inline desktop window logic
        const fileExplorerWindow = document.getElementById('file-explorer-window');
        if (fileExplorerWindow) {
            console.log('Making file explorer draggable using desktop window logic...');
            
            // Use exact same logic as desktop windows
            const titleBar = fileExplorerWindow.querySelector('.title-bar');
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;
            
            titleBar.addEventListener('mousedown', function(e) {
                e.preventDefault();
                isDragging = true;
                offsetX = e.clientX - fileExplorerWindow.offsetLeft;
                offsetY = e.clientY - fileExplorerWindow.offsetTop;
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
            
            function handleMouseMove(e) {
                if (isDragging) {
                    fileExplorerWindow.style.left = (e.clientX - offsetX) + 'px';
                    fileExplorerWindow.style.top = (e.clientY - offsetY) + 'px';
                }
            }
            
            function handleMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
            
            console.log('File explorer should now be draggable');
        } else {
            console.error('File explorer window not found!');
        }
    }

    generateProgressChecklist() {
        const tasks = [
            { id: 'decrypt-logs', text: 'Decrypt system log files', completed: false },
            { id: 'repair-registry', text: 'Repair corrupted registry', completed: false },
            { id: 'analyze-hex', text: 'Analyze virus signatures', completed: false },
            { id: 'collect-evidence', text: 'Collect all evidence', completed: false },
            { id: 'find-payload', text: 'Locate primary payload', completed: false }
        ];
        
        return tasks.map(task => `
            <div id="task-${task.id}" style="
                display: flex; align-items: center; margin-bottom: 5px; 
                padding: 3px; border-radius: 3px; font-size: 12px;
                ${task.completed ? 'background: rgba(76,175,80,0.2); color: #4CAF50;' : 'color: #ccc;'}
            ">
                <span style="margin-right: 8px; font-size: 10px;">
                    ${task.completed ? '✅' : '⭕'}
                </span>
                ${task.text}
            </div>
        `).join('');
    }

    updateProgress() {
        // Update evidence count
        const evidenceEl = document.getElementById('evidence-count');
        const repairEl = document.getElementById('repair-count');
        const analysisEl = document.getElementById('analysis-count');
        
        if (evidenceEl) evidenceEl.textContent = this.evidenceCollected.length;
        if (repairEl) repairEl.textContent = this.repairedFiles.length;
        if (analysisEl) analysisEl.textContent = this.analysisCompleted.length;
        
        // Calculate overall progress
        const totalTasks = this.level.files.length;
        const completedTasks = this.evidenceCollected.length + this.repairedFiles.length + this.analysisCompleted.length;
        const progressPercent = Math.round((completedTasks / totalTasks) * 100);
        
        const progressEl = document.getElementById('overall-progress');
        const progressBarEl = document.getElementById('progress-bar');
        
        if (progressEl) progressEl.textContent = progressPercent;
        if (progressBarEl) progressBarEl.style.width = progressPercent + '%';
        
        // Update specific task checkmarks
        this.updateTaskChecklist();
        
        // Show completion feedback
        if (progressPercent === 100) {
            this.showCompletionFeedback();
        }
    }

    updateTaskChecklist() {
        const tasks = {
            'decrypt-logs': this.evidenceCollected.some(e => e.includes('log')),
            'repair-registry': this.repairedFiles.some(r => r.includes('registry')),
            'analyze-hex': this.analysisCompleted.some(a => a.includes('virus')),
            'collect-evidence': this.evidenceCollected.length >= 2,
            'find-payload': this.evidenceCollected.length >= 3 && this.repairedFiles.length >= 1
        };
        
        Object.entries(tasks).forEach(([taskId, completed]) => {
            const taskEl = document.getElementById(`task-${taskId}`);
            if (taskEl && completed) {
                taskEl.style.background = 'rgba(76,175,80,0.2)';
                taskEl.style.color = '#4CAF50';
                taskEl.querySelector('span').textContent = '✅';
            }
        });
    }

    showCompletionFeedback() {
        const progressPanel = document.getElementById('progress-panel');
        if (progressPanel && !document.getElementById('completion-notice')) {
            progressPanel.insertAdjacentHTML('beforeend', `
                <div id="completion-notice" style="
                    margin-top: 15px; padding: 10px; 
                    background: rgba(76,175,80,0.2); 
                    border: 1px solid #4CAF50; 
                    border-radius: 4px; text-align: center;
                    animation: pulse 1s infinite;
                ">
                    <div style="color: #4CAF50; font-weight: bold;">🎉 INVESTIGATION COMPLETE! 🎉</div>
                    <div style="font-size: 12px; margin-top: 5px;">
                        All evidence collected and analyzed!
                    </div>
                    <button onclick="fileInvestigation.completeLevelInvestigation()" style="
                        margin-top: 8px; padding: 5px 15px; 
                        background: #4CAF50; color: white; 
                        border: none; border-radius: 3px; cursor: pointer;
                    ">Continue to Next Level</button>
                </div>
            `);
        }
    }

    minimizeWindow() {
        const window = document.getElementById('file-explorer-window');
        if (window) {
            window.style.display = window.style.display === 'none' ? 'block' : 'none';
        }
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
        if (!this.level || !this.level.files) return '<div>No files available</div>';
        
        return `
            <div style="margin-bottom: 15px; padding: 8px; background: #e0e0e0; border: 1px inset #c0c0c0; font-size: 12px;">
                <strong>📁 System Files Directory</strong><br>
                <span style="font-size: 11px; color: #666;">Click files to investigate • Look for evidence, corrupted files, and suspicious data</span>
            </div>
            
            <div class="file-list">
                ${this.level.files.map(file => {
                    const icon = this.getFileIcon(file.type);
                    let statusClass = '';
                    let statusText = 'Normal';
                    
                    if (file.corrupted) {
                        statusClass = 'corrupted';
                        statusText = 'Corrupted';
                    } else if (file.encrypted) {
                        statusClass = 'encrypted';
                        statusText = 'Encrypted';
                    } else if (file.hidden) {
                        statusClass = 'hidden';
                        statusText = 'Hidden';
                    }
                    
                    return `
                        <div class="file-item file-list-item ${statusClass}" 
                             data-filename="${file.name}" 
                             data-type="${file.type}"
                             onclick="fileInvestigation.investigateFile('${file.name}', '${file.type}')"
                             style="
                                display: flex; align-items: center; padding: 8px; 
                                border-bottom: 1px solid #ddd; cursor: pointer;
                                transition: background-color 0.2s; margin-bottom: 2px;
                             "
                             onmouseover="this.style.backgroundColor='#e6f3ff'" 
                             onmouseout="this.style.backgroundColor='transparent'">
                            <span style="margin-right: 10px; font-size: 16px;">${icon}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold; font-size: 12px;">${file.name}</div>
                                <div style="font-size: 10px; color: #666; opacity: 0.8;">
                                    ${file.type.toUpperCase()} • ${statusText} • ${file.points || 100} pts
                                </div>
                            </div>
                            <div style="font-size: 10px; color: #888; text-align: right;">
                                ${this.getFileStatus(file)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 20px; padding: 8px; background: #f0f0f0; border: 1px inset #c0c0c0; font-size: 11px;">
                <strong>Investigation Tips:</strong><br>
                • 📋 Evidence files contain clues about the infection<br>
                • 🔧 Repair files need to be fixed before analysis<br>
                • 🔬 Analysis files require pattern recognition<br>
                • 📄 Story files provide narrative context
            </div>
        `;
    }

    getFileStatus(file) {
        if (this.evidenceCollected.includes(file.name)) return '✅ Collected';
        if (this.repairedFiles.includes(file.name)) return '🔧 Repaired';
        if (this.analysisCompleted.includes(file.name)) return '🔬 Analyzed';
        if (file.corrupted) return '⚠️ Needs Repair';
        if (file.encrypted) return '🔒 Encrypted';
        if (file.hidden) return '👻 Hidden';
        return '📄 Ready';
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
            
            if (!this.repairedFiles.includes(filename)) {
                this.repairedFiles.push(filename);
            }
            
            this.closeModal();
            this.showSuccess(`✅ ${filename} successfully repaired!`);
            this.updateProgress();
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
            
            if (!this.analysisCompleted.includes(filename)) {
                this.analysisCompleted.push(filename);
            }
            
            this.closeModal();
            this.showSuccess(`✅ Correct analysis! ${filename} decoded.`);
            this.updateProgress();
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
        this.updateProgress();
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
        this.closeModal(); // Close any existing modal
        
        // Find next available position for modal
        const existingModals = document.querySelectorAll('.investigation-modal').length;
        const offsetX = existingModals * 30;
        const offsetY = existingModals * 30;
        
        const modal = document.createElement('div');
        modal.className = 'investigation-modal draggable';
        modal.id = 'investigation-modal';
        modal.style.cssText = `
            position: fixed; 
            top: ${150 + offsetY}px; 
            left: ${400 + offsetX}px; 
            width: 500px; 
            max-height: 400px;
            background: #c0c0c0; 
            border: 2px outset #c0c0c0; 
            z-index: 10010;
            font-family: Tahoma, sans-serif;
            box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        `;
        
        modal.innerHTML = `
            <div class="title-bar" style="
                background: linear-gradient(to right, #0078d4, #106ebe);
                color: white; padding: 4px 8px; 
                display: flex; justify-content: space-between; align-items: center;
                cursor: move;
            ">
                <span class="title" style="font-weight: bold; font-size: 12px;">${title}</span>
                <button onclick="fileInvestigation.closeModal()" style="
                    background: #c0c0c0; border: 1px outset #c0c0c0; 
                    width: 20px; height: 18px; font-size: 10px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                ">×</button>
            </div>
            <div class="modal-content" style="
                padding: 15px; 
                max-height: 350px; 
                overflow-y: auto;
                font-size: 12px;
                line-height: 1.4;
            ">
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Make modal draggable using the same simple logic
        this.makeWindowDraggable(modal);
        
        // Update progress after modal is created
        setTimeout(() => this.updateProgress(), 100);
        
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

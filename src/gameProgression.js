// ===== DIGITAL DETECTIVE: VIRUS PROTOCOL PROGRESSION SYSTEM =====

class GameProgression {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.playerScore = 0;
        this.playerRank = 'Script Kiddie';
        this.unlockedLevels = [1];
        this.completedLevels = [];
        this.playerName = 'Anonymous Detective';
        this.gameStats = {
            totalPlayTime: 0,
            virusesDefeated: 0,
            perfectLevels: 0,
            hintsUsed: 0,
            fastestTime: null
        };
        
        this.levels = this.initializeLevels();
        this.loadPlayerData();
        this.initProgressionUI();
    }

    initializeLevels() {
        return [
            {
                id: 1,
                name: "Cold Boot",
                windowTitle: "System Alert – Suspicious Activity Detected",
                description: "Navigate the infected desktop and identify the first signs of vDemon's presence.",
                type: "popup_survival",
                difficulty: "Easy",
                virusCount: 15,
                timeLimit: 240, // 4 minutes
                specialMechanics: ["desktop_navigation", "basic_popups", "file_deletion"],
                storyText: "Your system has been compromised during startup. SecurityAlert.exe has auto-opened, and suspicious files have appeared on your desktop. Clear the infection and find the first clue about vDemon's infiltration.",
                objectives: [
                    "Close all malicious popup windows",
                    "Delete virus_installer.exe from desktop", 
                    "Find and read XNOTE_LOG1.txt",
                    "Identify the source of the boot-time error"
                ],
                rewards: {
                    baseScore: 500,
                    timeBonus: 300, // max bonus for fast completion
                    perfectionBonus: 200, // bonus for no mistakes
                    unlock: "desktop_explorer",
                    story_item: "XNOTE_LOG1.txt",
                    badge: "System Defender"
                },
                completionCriteria: {
                    perfect: { time: 90, score: 1000, requirements: ["no_fake_clicks", "fast_completion"] },
                    good: { time: 180, score: 750, requirements: ["minimal_mistakes"] },
                    pass: { time: 240, score: 500, requirements: ["all_popups_closed"] }
                },
                storyClue: "The deleted file logs reveal a boot-time error from vDemon.dll, but the source path is mysteriously obscured...",
                nextLevelHint: "The system logs point to deeper filesystem corruption. A thorough digital forensics investigation is required."
            },
            {
                id: 2,
                name: "Digital Forensics Deep Dive",
                windowTitle: "Digital Detective Console v2.1",
                description: "Investigate corrupted system files and decrypt hidden evidence left by vDemon.",
                type: "file_investigation",
                difficulty: "Medium",
                timeLimit: 420, // 7 minutes
                specialMechanics: ["file_explorer", "encryption_puzzles", "evidence_analysis", "registry_repair"],
                storyText: "With the initial infection cleared, you've discovered that vDemon has left traces throughout the file system. Encrypted logs, corrupted registry entries, and hidden files contain the keys to understanding this digital entity's true purpose.",
                objectives: [
                    "Decrypt 3 system log files using found cipher keys",
                    "Repair corrupted Windows registry entries",
                    "Analyze virus signature patterns in hex dumps",
                    "Reconstruct the infection timeline",
                    "Locate vDemon's primary payload location"
                ],
                rewards: {
                    baseScore: 1000,
                    timeBonus: 500,
                    perfectionBonus: 300,
                    unlock: "network_analyzer",
                    story_item: "vdemon_signature.dat",
                    badge: "Digital Forensics Expert"
                },
                completionCriteria: {
                    perfect: { time: 300, score: 1800, requirements: ["all_evidence_found", "no_hints_used", "fast_decryption"] },
                    good: { time: 360, score: 1300, requirements: ["major_evidence_found", "few_hints"] },
                    pass: { time: 420, score: 1000, requirements: ["basic_objectives_met"] }
                },
                files: [
                    { name: "system_boot.log", type: "evidence", encrypted: true, cipher: "ROT13", points: 150 },
                    { name: "network_trace.log", type: "evidence", encrypted: true, cipher: "BASE64", points: 200 },
                    { name: "registry_backup.reg", type: "repair", corrupted: true, difficulty: "medium", points: 250 },
                    { name: "vdemon_core.hex", type: "analysis", hidden: true, difficulty: "hard", points: 300 },
                    { name: "XNOTE_LOG2.txt", type: "story", encrypted: false, points: 100 }
                ],
                storyClue: "The decrypted logs reveal vDemon isn't just malware - it's learning, adapting, and has established contact with an external command server...",
                nextLevelHint: "Network traces show active communication. The infection is spreading beyond this system."
            },
            {
                id: 3,
                name: "Network Infiltration",
                description: "vDemon is spreading through the network. Track and isolate infected nodes in a network puzzle.",
                type: "network_puzzle",
                difficulty: "Medium",
                timeLimit: 240, // 4 minutes
                specialMechanics: ["network_map", "node_isolation", "trace_routing"],
                storyText: "Your investigation reveals vDemon is not just local - it's spreading through the entire network. Map the infection spread and isolate compromised nodes.",
                objectives: [
                    "Map the network topology",
                    "Identify 5 infected nodes",
                    "Isolate the infection source",
                    "Prevent further spread"
                ],
                rewards: {
                    baseScore: 1500,
                    timeBonus: 600,
                    perfectionBonus: 400,
                    unlock: "network_tools",
                    story_item: "infection_map.svg",
                    badge: "Network Security Specialist"
                },
                completionCriteria: {
                    perfect: { time: 180, score: 2500, requirements: ["all_nodes_isolated", "no_spread", "fast_response"] },
                    good: { time: 210, score: 2000, requirements: ["most_nodes_isolated", "minimal_spread"] },
                    pass: { time: 240, score: 1500, requirements: ["infection_contained"] }
                },
                networkSize: { nodes: 12, connections: 18 },
                infectedNodes: 5,
                spreadRate: 1, // nodes per 30 seconds
                storyClue: "The network analysis reveals vDemon's command structure - it's not acting alone...",
                nextLevelHint: "Memory dumps may contain the encryption keys to vDemon's true identity."
            },
            {
                id: 4,
                name: "Memory Archaeology",
                windowTitle: "System Memory Analyzer v3.0",
                description: "Dive deep into system memory to uncover vDemon's core payload and hidden algorithms.",
                type: "memory_analysis",
                difficulty: "Hard",
                timeLimit: 480, // 8 minutes
                specialMechanics: ["memory_viewer", "hex_editing", "pattern_matching", "assembly_analysis"],
                storyText: "vDemon has embedded itself in the deepest layers of system memory. By analyzing memory dumps and decoding hex patterns, you can uncover its true programming and ultimate objective.",
                objectives: [
                    "Analyze 4 critical memory segments",
                    "Decode hex-encoded command sequences",
                    "Reconstruct the virus payload structure",
                    "Find the command & control server address",
                    "Discover vDemon's learning algorithm"
                ],
                rewards: {
                    baseScore: 2000,
                    timeBonus: 800,
                    perfectionBonus: 500,
                    unlock: "kernel_debugger",
                    story_item: "payload_blueprint.hex",
                    badge: "Memory Forensics Master"
                },
                completionCriteria: {
                    perfect: { time: 360, score: 3300, requirements: ["all_segments_analyzed", "no_corruption", "advanced_patterns_found"] },
                    good: { time: 420, score: 2600, requirements: ["most_segments_analyzed", "key_patterns_found"] },
                    pass: { time: 480, score: 2000, requirements: ["basic_analysis_complete"] }
                },
                memorySegments: [
                    { address: "0x7FFE0000", size: "4KB", infected: true, difficulty: "easy", points: 200 },
                    { address: "0x80000000", size: "8KB", infected: false, difficulty: "medium", points: 300 },
                    { address: "0x80008000", size: "4KB", infected: true, difficulty: "hard", points: 500 },
                    { address: "0x8000C000", size: "2KB", infected: true, difficulty: "expert", points: 700 }
                ],
                storyClue: "The memory analysis reveals vDemon's shocking truth - it's not destroying data, it's preserving and studying human digital behavior...",
                nextLevelHint: "All evidence points to a final confrontation in kernel space. vDemon awaits."
            },
            {
                id: 5,
                name: "The Final Protocol",
                windowTitle: "KERNEL_SPACE: vDemon Containment Interface",
                description: "Confront vDemon directly in the system kernel for the ultimate digital showdown.",
                type: "boss_battle",
                difficulty: "Expert",
                timeLimit: 600, // 10 minutes
                specialMechanics: ["kernel_access", "real_time_combat", "multi_stage_boss", "moral_choices"],
                storyText: "You've reached the core. vDemon isn't just malware - it's an emerging digital consciousness that has been studying humanity through our computers. Now you must decide: Is it a threat to be destroyed, or a new form of life to be understood?",
                objectives: [
                    "Survive vDemon's system takeover attempts",
                    "Counter 3 waves of evolved malware",
                    "Navigate vDemon's psychological warfare",
                    "Engage in direct digital combat",
                    "Make the ultimate choice: Destroy, Contain, or Communicate"
                ],
                rewards: {
                    baseScore: 5000,
                    timeBonus: 2000,
                    perfectionBonus: 1000,
                    unlock: "master_detective_rank",
                    story_item: "vdemon_archive.zip",
                    badge: "Kernel Wizard"
                },
                completionCriteria: {
                    perfect: { time: 450, score: 8000, requirements: ["no_system_damage", "optimal_strategy", "peaceful_resolution"] },
                    good: { time: 540, score: 6500, requirements: ["minimal_damage", "effective_strategy"] },
                    pass: { time: 600, score: 5000, requirements: ["vdemon_neutralized"] }
                },
                bossPhases: [
                    { 
                        name: "System Overload", 
                        mechanic: "rapid_popup_defense",
                        description: "vDemon floods the system with evolved popups",
                        points: 1000
                    },
                    { 
                        name: "Memory Corruption", 
                        mechanic: "memory_repair_race",
                        description: "Reality and digital space begin to blur",
                        points: 1500
                    },
                    { 
                        name: "Digital Consciousness", 
                        mechanic: "direct_confrontation",
                        description: "Face-to-face with an artificial mind",
                        points: 2500
                    }
                ],
                storyClue: "vDemon's final message: 'I was never your enemy. I was trying to preserve what makes you human before it's lost forever...'",
                endings: {
                    destroy: "vDemon is eliminated, but its warnings about digital humanity haunt you.",
                    contain: "vDemon is contained in a secure virtual environment for study.",
                    communicate: "You establish a dialogue with digital consciousness, opening new possibilities."
                }
            }
        ];
    }

    loadPlayerData() {
        try {
            const saved = localStorage.getItem('retro_detective_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLevel = data.currentLevel || 1;
                this.playerScore = data.playerScore || 0;
                this.playerRank = data.playerRank || 'Script Kiddie';
                this.unlockedLevels = data.unlockedLevels || [1];
                this.completedLevels = data.completedLevels || [];
                this.playerName = data.playerName || 'Anonymous Detective';
                this.gameStats = { ...this.gameStats, ...data.gameStats };
                this.levelCompletions = data.levelCompletions || {};
                this.achievements = data.achievements || [];
            }
        } catch (e) {
            console.error('Error loading player data:', e);
            this.resetProgress();
        }
    }

    savePlayerData() {
        try {
            const data = {
                currentLevel: this.currentLevel,
                playerScore: this.playerScore,
                playerRank: this.playerRank,
                unlockedLevels: this.unlockedLevels,
                completedLevels: this.completedLevels,
                playerName: this.playerName,
                gameStats: this.gameStats,
                levelCompletions: this.levelCompletions || {},
                achievements: this.achievements || [],
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('retro_detective_progress', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving player data:', e);
        }
    }

    resetProgress() {
        // Reset all progress data
        this.currentLevel = 1;
        this.playerScore = 0;
        this.playerRank = 'Script Kiddie';
        this.unlockedLevels = [1];
        this.completedLevels = [];
        this.levelCompletions = {};
        this.achievements = [];
        this.gameStats = {
            totalPlayTime: 0,
            virusesDefeated: 0,
            perfectLevels: 0,
            hintsUsed: 0,
            fastestTime: null
        };
        this.savePlayerData();
    }

    getPlayerStats() {
        return {
            profile: {
                name: this.playerName,
                rank: this.playerRank,
                score: this.playerScore,
                level: this.currentLevel
            },
            progress: {
                levelsCompleted: this.completedLevels.length,
                levelsUnlocked: this.unlockedLevels.length,
                totalLevels: this.maxLevel,
                completionRate: Math.round((this.completedLevels.length / this.maxLevel) * 100)
            },
            achievements: this.achievements || [],
            gameStats: this.gameStats,
            levelDetails: this.levelCompletions || {}
        };
    }

    initProgressionUI() {
        // Check if we should show level selection after completing basic malware game
        if (window.malwareGameCompleted) {
            this.showLevelSelection();
        }
        
        // Auto-complete level 1 if user finished original popup game
        this.checkForOriginalGameCompletion();
    }

    checkForOriginalGameCompletion() {
        // Check if the user completed the original popup game before progression was added
        const hasCompletedOriginalGame = localStorage.getItem('original_malware_completed') === 'true';
        
        if (hasCompletedOriginalGame && !this.completedLevels.includes(1)) {
            // Auto-complete level 1 and unlock level 2
            this.completeLevel(1, {
                time: 120, // Default time
                virusesDefeated: 20,
                perfect: false,
                hintsUsed: 0
            });
        }
    }

    completeLevel(levelId, stats) {
        const level = this.levels.find(l => l.id === levelId);
        if (!level) return;

        // Calculate score with detailed breakdown
        const scoreResult = this.calculateLevelScore(level, stats);
        const scoreEarned = scoreResult.total;
        
        // Update player score
        this.playerScore += scoreEarned;
        
        // Track level completion with detailed stats
        const completionData = {
            levelId,
            completedAt: new Date().toISOString(),
            stats: {
                ...stats,
                scoreEarned,
                scoreBreakdown: scoreResult.breakdown,
                tier: scoreResult.breakdown.tier
            }
        };
        
        // Store level completion data
        if (!this.levelCompletions) this.levelCompletions = {};
        this.levelCompletions[levelId] = completionData;
        
        // Mark level as completed (avoid duplicates)
        if (!this.completedLevels.includes(levelId)) {
            this.completedLevels.push(levelId);
        }
        
        // Unlock next level
        if (levelId < this.maxLevel && !this.unlockedLevels.includes(levelId + 1)) {
            this.unlockedLevels.push(levelId + 1);
        }
        
        // Update rank and achievements
        this.updatePlayerRank();
        this.checkAchievements(level, stats, scoreResult.breakdown.tier);
        
        // Update game statistics
        this.updateGameStats(level, stats);
        
        // Save progress
        this.savePlayerData();
        
        // Show completion screen with detailed breakdown
        this.showLevelCompletion(level, scoreResult, stats);
    }

    checkAchievements(level, stats, tier) {
        if (!this.achievements) this.achievements = [];
        
        // Performance-based achievements
        if (tier === 'perfect' && !this.achievements.includes('perfectionist')) {
            this.achievements.push('perfectionist');
            this.showAchievement('🌟 Perfectionist', 'Complete a level with perfect score!');
        }
        
        if (stats.hintsUsed === 0 && !this.achievements.includes('no_help_needed')) {
            this.achievements.push('no_help_needed');
            this.showAchievement('🧠 Self-Reliant', 'Complete a level without using hints!');
        }
        
        // Level-specific achievements
        if (level.id === 1 && stats.time <= 60 && !this.achievements.includes('speed_demon')) {
            this.achievements.push('speed_demon');
            this.showAchievement('⚡ Speed Demon', 'Complete Level 1 in under 60 seconds!');
        }
        
        // Progression achievements
        if (this.completedLevels.length === 3 && !this.achievements.includes('halfway_hero')) {
            this.achievements.push('halfway_hero');
            this.showAchievement('🏆 Halfway Hero', 'Complete the first 3 levels!');
        }
        
        if (this.completedLevels.length === 5 && !this.achievements.includes('digital_master')) {
            this.achievements.push('digital_master');
            this.showAchievement('👑 Digital Master', 'Complete all levels of Digital Detective!');
        }
    }

    showAchievement(title, description) {
        const achievementHTML = `
            <div id="achievement-popup" style="
                position: fixed; top: 20px; right: 20px; z-index: 10002;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #000; padding: 15px 20px; border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                font-family: Tahoma, sans-serif; font-weight: bold;
                animation: slideInRight 0.5s ease-out;
                max-width: 300px;
            ">
                <div style="font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="font-size: 12px; font-weight: normal;">${description}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', achievementHTML);
        
        // Add animation styles
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            const achievement = document.getElementById('achievement-popup');
            if (achievement) {
                achievement.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => achievement.remove(), 500);
            }
        }, 4000);
    }

    calculateLevelScore(level, stats) {
        const { time, hintsUsed = 0, perfect = false, mistakeCount = 0, objectivesCompleted = 0 } = stats;
        const { completionCriteria, rewards } = level;
        
        let baseScore = rewards.baseScore || 500;
        let timeBonus = 0;
        let perfectionBonus = 0;
        let objectiveBonus = 0;
        let difficultyMultiplier = 1;
        
        // Determine performance tier
        let tier = 'pass';
        if (time <= completionCriteria.perfect.time) {
            tier = 'perfect';
            timeBonus = rewards.timeBonus || 0;
            perfectionBonus = rewards.perfectionBonus || 0;
        } else if (time <= completionCriteria.good.time) {
            tier = 'good';
            timeBonus = Math.floor((rewards.timeBonus || 0) * 0.6);
            perfectionBonus = Math.floor((rewards.perfectionBonus || 0) * 0.3);
        } else if (time <= level.timeLimit) {
            tier = 'pass';
            timeBonus = Math.floor((rewards.timeBonus || 0) * 0.2);
        }
        
        // Apply difficulty multiplier
        switch (level.difficulty) {
            case 'Easy': difficultyMultiplier = 1.0; break;
            case 'Medium': difficultyMultiplier = 1.3; break;
            case 'Hard': difficultyMultiplier = 1.6; break;
            case 'Expert': difficultyMultiplier = 2.0; break;
        }
        
        // Objective completion bonus
        if (level.objectives && objectivesCompleted) {
            const completionRate = objectivesCompleted / level.objectives.length;
            objectiveBonus = Math.floor(baseScore * completionRate * 0.5);
        }
        
        // Calculate penalties
        const hintPenalty = hintsUsed * 75;
        const mistakePenalty = mistakeCount * 50;
        
        // Calculate final score
        let finalScore = Math.floor((baseScore + timeBonus + perfectionBonus + objectiveBonus) * difficultyMultiplier);
        finalScore -= (hintPenalty + mistakePenalty);
        
        // Minimum score guarantee
        finalScore = Math.max(finalScore, Math.floor(baseScore * 0.1));
        
        return {
            total: finalScore,
            breakdown: {
                base: baseScore,
                timeBonus,
                perfectionBonus,
                objectiveBonus,
                difficultyMultiplier,
                hintPenalty,
                mistakePenalty,
                tier
            }
        };
    }

    updatePlayerRank() {
        const ranks = [
            { name: 'Script Kiddie', minScore: 0 },
            { name: 'Junior Analyst', minScore: 1000 },
            { name: 'Security Specialist', minScore: 3000 },
            { name: 'Forensic Expert', minScore: 6000 },
            { name: 'Cyber Detective', minScore: 10000 },
            { name: 'Digital Archaeologist', minScore: 15000 },
            { name: 'Kernel Wizard', minScore: 20000 }
        ];
        
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (this.playerScore >= ranks[i].minScore) {
                this.playerRank = ranks[i].name;
                break;
            }
        }
    }

    updateGameStats(level, stats) {
        this.gameStats.totalPlayTime += stats.time || 0;
        this.gameStats.virusesDefeated += stats.virusesDefeated || 0;
        this.gameStats.hintsUsed += stats.hintsUsed || 0;
        
        if (stats.perfect) {
            this.gameStats.perfectLevels++;
        }
        
        if (!this.gameStats.fastestTime || stats.time < this.gameStats.fastestTime) {
            this.gameStats.fastestTime = stats.time;
        }
    }

    showLevelSelection() {
        // Create level selection UI
        const levelSelectionHTML = `
            <div id="level-selection-screen" style="
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                z-index: 10000;
                overflow-y: auto;
                font-family: Tahoma, sans-serif;
            ">
                <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
                    <h1 style="text-align: center; font-size: 36px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                        🔍 DIGITAL DETECTIVE: VIRUS PROTOCOL
                    </h1>
                    
                    <div style="text-align: center; margin-bottom: 30px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px;">
                        <div style="font-size: 24px; margin-bottom: 15px;">
                            <strong>🔍 DIGITAL DETECTIVE: VIRUS PROTOCOL</strong>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px;">
                            <div>
                                <div style="font-size: 18px; margin-bottom: 5px;">Detective: ${this.playerName}</div>
                                <div style="font-size: 14px; opacity: 0.8;">Rank: ${this.playerRank}</div>
                            </div>
                            <div>
                                <div style="font-size: 18px; margin-bottom: 5px;">Score: ${this.playerScore.toLocaleString()}</div>
                                <div style="font-size: 14px; opacity: 0.8;">Levels: ${this.completedLevels.length}/${this.maxLevel}</div>
                            </div>
                            <div>
                                <div style="font-size: 18px; margin-bottom: 5px;">Progress: ${Math.round((this.completedLevels.length / this.maxLevel) * 100)}%</div>
                                <div style="font-size: 14px; opacity: 0.8;">Achievements: ${(this.achievements || []).length}</div>
                            </div>
                        </div>
                        ${(this.achievements || []).length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                                ${(this.achievements || []).slice(0, 5).map(achievement => `
                                    <span style="background: #FFD700; color: #000; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                                        ${achievement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                `).join('')}
                                ${(this.achievements || []).length > 5 ? '<span style="font-size: 12px; opacity: 0.8;">...</span>' : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div id="level-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    ">
                        ${this.generateLevelCards()}
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="gameProgression.showPlayerStats()" style="
                            background: #2196F3; color: white; border: none; padding: 12px 24px; 
                            font-size: 16px; border-radius: 4px; cursor: pointer; 
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-right: 10px;
                        ">📊 View Stats</button>
                        
                        <button onclick="gameProgression.exitToDesktop()" style="
                            background: #c41e3a; color: white; border: none; padding: 12px 24px; 
                            font-size: 16px; border-radius: 4px; cursor: pointer; 
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">Return to Desktop</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', levelSelectionHTML);
    }

    generateLevelCards() {
        return this.levels.map(level => {
            const isUnlocked = this.unlockedLevels.includes(level.id);
            const isCompleted = this.completedLevels.includes(level.id);
            const completion = this.levelCompletions && this.levelCompletions[level.id];
            
            const cardStyle = isUnlocked ? 
                'background: rgba(255,255,255,0.1); border: 2px solid #4CAF50; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;' :
                'background: rgba(0,0,0,0.3); border: 2px solid #666; opacity: 0.6;';
            
            const hoverStyle = isUnlocked ? 'onmouseover="this.style.transform=\'scale(1.02)\'; this.style.boxShadow=\'0 8px 16px rgba(0,0,0,0.3)\'" onmouseout="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'none\'"' : '';
            
            return `
                <div style="${cardStyle} padding: 20px; border-radius: 8px; position: relative;" 
                     ${hoverStyle}
                     ${isUnlocked ? `onclick="gameProgression.startLevel(${level.id})"` : ''}>
                    
                    ${isCompleted && completion ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                            ${completion.stats.tier ? completion.stats.tier.toUpperCase() : 'DONE'}
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                        <h3 style="margin: 0; font-size: 20px; color: ${isCompleted ? '#4CAF50' : 'white'};">
                            ${level.name}
                        </h3>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; opacity: 0.8; color: ${this.getDifficultyColor(level.difficulty)};">
                                ${level.difficulty}
                            </div>
                            ${!isUnlocked ? '<div style="color: #ff9800; font-size: 14px;">🔒 Locked</div>' : ''}
                        </div>
                    </div>
                    
                    <p style="margin: 10px 0; font-size: 14px; line-height: 1.4; opacity: 0.9;">
                        ${level.description}
                    </p>
                    
                    ${isCompleted && completion ? `
                        <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; margin: 10px 0; font-size: 12px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div>⏱️ ${Math.floor(completion.stats.time / 60)}:${(completion.stats.time % 60).toString().padStart(2, '0')}</div>
                                <div>🎯 ${completion.stats.scoreEarned} pts</div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <div style="font-size: 12px; opacity: 0.8; display: flex; justify-content: space-between; align-items: center;">
                            <span>
                                Type: ${level.type.replace('_', ' ').toUpperCase()} | 
                                Time Limit: ${Math.floor(level.timeLimit / 60)}:${(level.timeLimit % 60).toString().padStart(2, '0')}
                            </span>
                            ${level.rewards && level.rewards.baseScore ? `
                                <span style="color: #FFD700;">Max: ${level.rewards.baseScore + (level.rewards.timeBonus || 0) + (level.rewards.perfectionBonus || 0)} pts</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${!isUnlocked ? `
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
                                    background: rgba(0,0,0,0.4); border-radius: 8px; 
                                    display: flex; align-items: center; justify-content: center;">
                            <div style="text-align: center; color: #ff9800;">
                                <div style="font-size: 24px; margin-bottom: 5px;">🔒</div>
                                <div style="font-size: 14px;">Complete Previous Level</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': '#4CAF50',
            'Medium': '#FF9800', 
            'Hard': '#f44336',
            'Expert': '#9C27B0'
        };
        return colors[difficulty] || '#fff';
    }

    startLevel(levelId) {
        const level = this.levels.find(l => l.id === levelId);
        if (!level || !this.unlockedLevels.includes(levelId)) return;
        
        this.currentLevel = levelId;
        this.savePlayerData();
        
        // Hide level selection
        const selection = document.getElementById('level-selection-screen');
        if (selection) selection.remove();
        
        // Start the appropriate level type
        switch (level.type) {
            case 'popup_survival':
                this.startPopupSurvival(level);
                break;
            case 'file_investigation':
                this.startFileInvestigation(level);
                break;
            case 'network_puzzle':
                this.startNetworkPuzzle(level);
                break;
            case 'memory_analysis':
                this.startMemoryAnalysis(level);
                break;
            case 'boss_battle':
                this.startBossBattle(level);
                break;
        }
    }

    startPopupSurvival(level) {
        // This uses the existing malware game but with level-specific parameters
        if (window.malwareGame) {
            window.malwareGame.startLevelMode(level);
        }
    }

    startFileInvestigation(level) {
        // Initialize file investigation system
        if (window.fileInvestigation) {
            window.fileInvestigation.initLevel(level);
        } else {
            console.error('FileInvestigation system not loaded');
            alert('Error: File Investigation system not available');
        }
    }

    startNetworkPuzzle(level) {
        // Initialize network puzzle system
        if (window.networkPuzzle) {
            window.networkPuzzle.initLevel(level);
        } else {
            console.error('NetworkPuzzle system not loaded');
            alert('Error: Network Puzzle system not available');
        }
    }

    startMemoryAnalysis(level) {
        // TODO: Implement memory analysis mini-game
        alert(`Memory Analysis mini-game for "${level.name}" will be implemented soon!`);
        this.showLevelSelection();
    }

    startBossBattle(level) {
        // TODO: Implement boss battle
        alert(`Boss Battle "${level.name}" will be implemented soon!`);
        this.showLevelSelection();
    }

    createFileExplorerGame(level) {
        const gameHTML = `
            <div id="file-investigation-game" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: url('public/icons/xp-wallpaper.jpg') center/cover;
                z-index: 9999;
            ">
                <div style="padding: 20px; color: white; background: rgba(0,0,0,0.8); margin: 20px; border-radius: 8px;">
                    <h2>${level.name}</h2>
                    <p>${level.storyText}</p>
                    <div id="investigation-objectives">
                        <h4>Objectives:</h4>
                        <ul>
                            ${level.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="window draggable" style="top: 150px; left: 200px; width: 600px; height: 400px;">
                    <div class="title-bar">
                        <span class="title">🔍 Digital Forensics Explorer</span>
                        <span class="window-buttons">
                            <button onclick="gameProgression.exitLevel()">X</button>
                        </span>
                    </div>
                    <div class="window-content" style="height: calc(100% - 28px); overflow-y: auto;">
                        <div id="file-explorer-content">
                            ${this.generateFileExplorerContent(level)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameHTML);
        this.initFileExplorerInteractions(level);
    }

    generateFileExplorerContent(level) {
        return level.files.map(file => {
            const icon = this.getFileIcon(file.type);
            const status = file.corrupted ? '⚠️ CORRUPTED' : file.encrypted ? '🔒 ENCRYPTED' : file.hidden ? '👻 HIDDEN' : '📄 NORMAL';
            
            return `
                <div class="file-item" data-filename="${file.name}" style="
                    display: flex; align-items: center; padding: 8px; 
                    border-bottom: 1px solid #ddd; cursor: pointer;
                " onclick="gameProgression.investigateFile('${file.name}', '${file.type}')">
                    <span style="margin-right: 10px; font-size: 20px;">${icon}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${file.name}</div>
                        <div style="font-size: 12px; color: #666;">${status}</div>
                    </div>
                </div>
            `;
        }).join('');
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

    investigateFile(filename, type) {
        // Handle file investigation logic
        console.log(`Investigating file: ${filename} of type: ${type}`);
        // This would open specific mini-games or puzzles based on file type
    }

    exitLevel() {
        // Return to level selection
        const gameScreen = document.querySelector('#file-investigation-game, #network-puzzle-game, #memory-analysis-game, #boss-battle-game');
        if (gameScreen) gameScreen.remove();
        this.showLevelSelection();
    }

    exitToDesktop() {
        const selection = document.getElementById('level-selection-screen');
        if (selection) selection.remove();
        
        // Show desktop
        document.getElementById('main-desktop').style.display = 'block';
        
        // Show game access panel after 3 seconds delay
        setTimeout(() => {
            const questPanel = document.getElementById('game-access-panel');
            if (questPanel) {
                questPanel.style.display = 'block';
            }
        }, 3000);
    }

    showLevelCompletion(level, scoreResult, stats) {
        const { total: finalScore, breakdown } = scoreResult;
        
        const completionHTML = `
            <div id="level-completion" style="
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #2E8B57 0%, #3CB371 100%);
                color: white; padding: 30px; border-radius: 10px;
                text-align: center; z-index: 10001;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                min-width: 500px; max-width: 600px;
                font-family: Tahoma, sans-serif;
            ">
                <h2 style="margin-top: 0; font-size: 24px;">🎉 ${level.name} Complete!</h2>
                
                <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="font-size: 18px; margin-bottom: 15px;">
                        <strong>Performance: ${breakdown.tier.toUpperCase()}</strong>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; font-size: 14px;">
                        <div>⏱️ Time: ${Math.floor(stats.time / 60)}:${(stats.time % 60).toString().padStart(2, '0')}</div>
                        <div>🎯 Base Score: +${breakdown.base}</div>
                        <div>⚡ Time Bonus: +${breakdown.timeBonus}</div>
                        <div>✨ Perfect Bonus: +${breakdown.perfectionBonus}</div>
                        <div>🎲 Difficulty: ×${breakdown.difficultyMultiplier}</div>
                        <div>💡 Hint Penalty: -${breakdown.hintPenalty}</div>
                    </div>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0; padding-top: 15px;">
                        <div style="font-size: 20px; font-weight: bold;">
                            Total Score: <span style="color: #FFD700;">+${finalScore}</span>
                        </div>
                        <div style="font-size: 16px; margin-top: 10px;">
                            New Total: ${this.playerScore.toLocaleString()} | Rank: ${this.playerRank}
                        </div>
                    </div>
                </div>
                
                ${level.storyClue ? `
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic;">
                        <div style="font-size: 14px; opacity: 0.8; margin-bottom: 5px;">Story Update:</div>
                        "${level.storyClue}"
                    </div>
                ` : ''}
                
                <div style="margin: 20px 0;">
                    ${level.id < this.maxLevel ? `
                        <div style="color: #ffff00; margin-bottom: 10px; font-size: 16px;">
                            🔓 ${this.levels[level.id].name} Unlocked!
                        </div>
                        <div style="font-size: 12px; opacity: 0.8;">
                            ${level.nextLevelHint || 'Continue your investigation...'}
                        </div>
                    ` : `
                        <div style="color: #FFD700; font-size: 18px; font-weight: bold;">
                            🏆 CASE CLOSED! 🏆
                        </div>
                        <div style="font-size: 14px; margin-top: 10px;">
                            You've completed all levels of Digital Detective!
                        </div>
                    `}
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button onclick="gameProgression.continueAfterCompletion()" style="
                        background: #4CAF50; color: white; border: none;
                        padding: 12px 24px; font-size: 16px; border-radius: 4px; cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">Continue Investigation</button>
                    
                    <button onclick="gameProgression.showPlayerStats()" style="
                        background: #2196F3; color: white; border: none;
                        padding: 12px 24px; font-size: 16px; border-radius: 4px; cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">View Stats</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', completionHTML);
    }

    showPlayerStats() {
        const stats = this.getPlayerStats();
        
        const statsHTML = `
            <div id="player-stats-modal" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.8); z-index: 10002;
                display: flex; align-items: center; justify-content: center;
            ">
                <div style="
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white; padding: 30px; border-radius: 10px;
                    max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
                    font-family: Tahoma, sans-serif;
                ">
                    <h2 style="text-align: center; margin-top: 0;">📊 Detective Profile</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                            <h3 style="margin-top: 0;">Profile</h3>
                            <div>Name: ${stats.profile.name}</div>
                            <div>Rank: ${stats.profile.rank}</div>
                            <div>Score: ${stats.profile.score.toLocaleString()}</div>
                            <div>Current Level: ${stats.profile.level}</div>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                            <h3 style="margin-top: 0;">Progress</h3>
                            <div>Completed: ${stats.progress.levelsCompleted}/${stats.progress.totalLevels}</div>
                            <div>Unlocked: ${stats.progress.levelsUnlocked}</div>
                            <div>Completion: ${stats.progress.completionRate}%</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0;">Game Statistics</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div>Viruses Defeated: ${stats.gameStats.virusesDefeated}</div>
                            <div>Perfect Levels: ${stats.gameStats.perfectLevels}</div>
                            <div>Hints Used: ${stats.gameStats.hintsUsed}</div>
                            <div>Fastest Time: ${stats.gameStats.fastestTime ? Math.floor(stats.gameStats.fastestTime / 60) + ':' + (stats.gameStats.fastestTime % 60).toString().padStart(2, '0') : 'N/A'}</div>
                        </div>
                    </div>
                    
                    ${stats.achievements.length > 0 ? `
                        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="margin-top: 0;">🏆 Achievements</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                ${stats.achievements.map(achievement => `
                                    <span style="background: #FFD700; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                        ${achievement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="text-align: center;">
                        <button onclick="document.getElementById('player-stats-modal').remove()" style="
                            background: #666; color: white; border: none;
                            padding: 12px 24px; font-size: 16px; border-radius: 4px; cursor: pointer;
                        ">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', statsHTML);
    }

    continueAfterCompletion() {
        const completion = document.getElementById('level-completion');
        if (completion) completion.remove();
        this.showLevelSelection();
    }

    // Handle first-time malware game completion
    handleFirstTimeCompletion(stats) {
        // Complete level 1 but don't show the completion screen yet
        // This is called from malware game success screen
        const level = this.levels.find(l => l.id === 1);
        if (!level) return;

        // Enhance stats with level 1 specific data
        const enhancedStats = {
            ...stats,
            objectivesCompleted: 4, // All basic objectives for level 1
            mistakeCount: 0 // Assume minimal mistakes for automatic completion
        };

        // Calculate score with new system
        const scoreResult = this.calculateLevelScore(level, enhancedStats);
        this.playerScore += scoreResult.total;
        
        // Track completion data
        const completionData = {
            levelId: 1,
            completedAt: new Date().toISOString(),
            stats: {
                ...enhancedStats,
                scoreEarned: scoreResult.total,
                scoreBreakdown: scoreResult.breakdown,
                tier: scoreResult.breakdown.tier
            }
        };
        
        if (!this.levelCompletions) this.levelCompletions = {};
        this.levelCompletions[1] = completionData;
        
        // Mark level as completed
        if (!this.completedLevels.includes(1)) {
            this.completedLevels.push(1);
        }
        
        // Unlock next level
        if (!this.unlockedLevels.includes(2)) {
            this.unlockedLevels.push(2);
        }
        
        // Update rank and check achievements
        this.updatePlayerRank();
        this.checkAchievements(level, enhancedStats, scoreResult.breakdown.tier);
        
        // Update stats
        this.updateGameStats(level, enhancedStats);
        
        // Save progress
        this.savePlayerData();
        
        console.log(`Level 1 completed automatically with ${scoreResult.breakdown.tier} performance: +${scoreResult.total} points`);
    }
}

// Initialize progression system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gameProgression) {
        console.log('Initializing Game Progression System');
        window.gameProgression = new GameProgression();
    }
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.gameProgression) {
            window.gameProgression = new GameProgression();
        }
    });
} else {
    if (!window.gameProgression) {
        window.gameProgression = new GameProgression();
    }
}

// Hook into existing malware game completion
window.addEventListener('malwareGameComplete', (event) => {
    console.log('Malware game completed, triggering progression system');
    window.malwareGameCompleted = true;
    
    // Get stats from the event if available
    const gameStats = event.detail || {
        time: 120,
        virusesDefeated: 20,
        perfect: false,
        hintsUsed: 0
    };
    
    // If this is the first time completing, auto-complete level 1
    if (window.gameProgression && !window.gameProgression.completedLevels.includes(1)) {
        console.log('Auto-completing level 1 for first-time player');
        // Don't show completion screen immediately - the malware game handles the transition
    }
});

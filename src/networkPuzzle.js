// ===== NETWORK PUZZLE MINI-GAME =====

class NetworkPuzzleSystem {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.infectedNodes = [];
        this.isolatedNodes = [];
        this.level = null;
        this.spreadInterval = null;
        this.gameCanvas = null;
        this.canvasContext = null;
        this.gameInterface = null;
    }

    initLevel(level) {
        this.level = level;
        this.level.startTime = Date.now();
        this.generateNetwork(level.networkSize);
        this.startInfection(level.infectedNodes, level.spreadRate);
        this.createNetworkInterface();
    }

    createNetworkInterface() {
        // Remove any existing interfaces
        const existing = document.getElementById('network-puzzle-game');
        if (existing) existing.remove();

        const gameHTML = `
            <div id="network-puzzle-game" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: url('public/icons/xp-wallpaper.jpg') center/cover;
                z-index: 9999;
                overflow: hidden;
            ">
                <div style="padding: 20px; color: white; background: rgba(0,0,0,0.8); margin: 20px; border-radius: 8px;">
                    <h2>${this.level.name}</h2>
                    <p>${this.level.storyText}</p>
                    <div id="network-objectives">
                        <h4>Objectives:</h4>
                        <ul>
                            ${this.level.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 10px;">
                        <span>Infected Nodes: <span id="infected-count">0</span></span> |
                        <span>Isolated Nodes: <span id="isolated-count">0</span></span> |
                        <span>Time: <span id="network-timer">00:00</span></span>
                    </div>
                </div>
                
                <div class="window draggable" style="top: 150px; left: 200px; width: 700px; height: 500px;">
                    <div class="title-bar">
                        <span class="title">🌐 Network Security Monitor</span>
                        <span class="window-buttons">
                            <button onclick="networkPuzzle.exitLevel()">X</button>
                        </span>
                    </div>
                    <div class="window-content" style="height: calc(100% - 28px); position: relative;">
                        <canvas id="network-canvas" width="680" height="450" style="
                            border: 2px solid #333; background: #1a1a1a; cursor: pointer;
                        "></canvas>
                        <div style="position: absolute; bottom: 10px; left: 10px; color: white; font-size: 12px;">
                            <div>🔴 Infected | 🟡 Spreading | 🟢 Clean | ⚫ Isolated</div>
                            <div>Click nodes to isolate them and stop the spread!</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameHTML);
        this.initializeCanvas();
        this.startNetworkTimer();
    }

    initializeCanvas() {
        this.gameCanvas = document.getElementById('network-canvas');
        this.canvasContext = this.gameCanvas.getContext('2d');
        
        // Add click handler
        this.gameCanvas.addEventListener('click', (e) => {
            const rect = this.gameCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleNodeClick(x, y);
        });
        
        // Start rendering
        this.renderNetwork();
        this.renderInterval = setInterval(() => this.renderNetwork(), 100);
    }

    startNetworkTimer() {
        this.timerInterval = setInterval(() => {
            if (this.level && this.level.startTime) {
                const elapsed = Math.floor((Date.now() - this.level.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                const timerElement = document.getElementById('network-timer');
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
        this.cleanup();
        alert('Time limit reached! Network security failed.');
        this.exitLevel();
    }

    generateNetwork(size) {
        this.nodes = [];
        this.connections = [];
        
        // Generate nodes in a grid-like pattern with some randomness
        const cols = Math.ceil(Math.sqrt(size.nodes));
        const rows = Math.ceil(size.nodes / cols);
        
        for (let i = 0; i < size.nodes; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            this.nodes.push({
                id: i,
                x: (col + 0.5) / cols * 600 + Math.random() * 40 - 20,
                y: (row + 0.5) / rows * 400 + Math.random() * 40 - 20,
                infected: false,
                isolated: false,
                type: this.getNodeType(i),
                label: this.getNodeLabel(i)
            });
        }
        
        // Generate connections
        this.generateConnections(size.connections);
    }

    getNodeType(id) {
        const types = ['server', 'workstation', 'router', 'firewall', 'database'];
        if (id === 0) return 'server'; // Main server
        if (id === 1) return 'firewall'; // Firewall
        return types[Math.floor(Math.random() * types.length)];
    }

    getNodeLabel(id) {
        const labels = [
            'Main Server', 'Firewall', 'Workstation-A', 'Workstation-B', 'Router-1',
            'Database', 'Print Server', 'File Server', 'Web Server', 'Mail Server',
            'Backup Server', 'Dev Machine'
        ];
        return labels[id] || `Node-${id}`;
    }

    generateConnections(maxConnections) {
        // Ensure all nodes are connected (minimum spanning tree)
        const connected = new Set([0]);
        const unconnected = new Set(this.nodes.slice(1).map(n => n.id));
        
        // Connect all nodes first
        while (unconnected.size > 0) {
            const connectedNode = Array.from(connected)[Math.floor(Math.random() * connected.size)];
            const unconnectedNode = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)];
            
            this.connections.push({
                from: connectedNode,
                to: unconnectedNode,
                active: true
            });
            
            connected.add(unconnectedNode);
            unconnected.delete(unconnectedNode);
        }
        
        // Add additional random connections
        const additionalConnections = maxConnections - this.connections.length;
        for (let i = 0; i < additionalConnections; i++) {
            const from = Math.floor(Math.random() * this.nodes.length);
            const to = Math.floor(Math.random() * this.nodes.length);
            
            if (from !== to && !this.hasConnection(from, to)) {
                this.connections.push({
                    from: from,
                    to: to,
                    active: true
                });
            }
        }
    }

    hasConnection(from, to) {
        return this.connections.some(conn => 
            (conn.from === from && conn.to === to) || 
            (conn.from === to && conn.to === from)
        );
    }

    startInfection(initialInfected, spreadRate) {
        // Infect random nodes initially
        const nodesToInfect = Math.min(initialInfected, this.nodes.length);
        const shuffled = [...this.nodes].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < nodesToInfect; i++) {
            shuffled[i].infected = true;
            this.infectedNodes.push(shuffled[i].id);
        }
        
        // Start spreading infection
        this.spreadInterval = setInterval(() => {
            this.spreadInfection();
        }, 30000 / spreadRate); // Spread based on rate
    }

    spreadInfection() {
        const newInfections = [];
        
        this.infectedNodes.forEach(infectedId => {
            const connectedNodes = this.getConnectedNodes(infectedId);
            
            connectedNodes.forEach(nodeId => {
                const node = this.nodes[nodeId];
                if (!node.infected && !node.isolated && Math.random() < 0.3) {
                    node.infected = true;
                    newInfections.push(nodeId);
                }
            });
        });
        
        this.infectedNodes.push(...newInfections);
        
        if (newInfections.length > 0) {
            this.updateNetworkDisplay();
            this.showSpreadAlert(newInfections.length);
        }
        
        // Check if game is lost (too many infected)
        if (this.infectedNodes.length > this.nodes.length * 0.7) {
            this.gameOver(false);
        }
    }

    getConnectedNodes(nodeId) {
        const connected = [];
        
        this.connections.forEach(conn => {
            if (conn.active) {
                if (conn.from === nodeId) connected.push(conn.to);
                if (conn.to === nodeId) connected.push(conn.from);
            }
        });
        
        return connected;
    }

    createNetworkInterface() {
        const gameHTML = `
            <div id="network-puzzle-game" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                z-index: 9999; color: white; font-family: Tahoma, sans-serif;
            ">
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2>🌐 Network Security Protocol</h2>
                        <div style="text-align: right;">
                            <div>Infected: <span id="infected-count">${this.infectedNodes.length}</span>/${this.nodes.length}</div>
                            <div>Isolated: <span id="isolated-count">0</span></div>
                            <button onclick="networkPuzzle.exitLevel()" style="
                                background: #c41e3a; color: white; border: none; padding: 8px 16px;
                                border-radius: 4px; cursor: pointer; margin-top: 5px;
                            ">Exit</button>
                        </div>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin-top: 0;">Mission Objectives:</h4>
                        <ul style="margin: 0;">
                            <li>Click infected nodes (red) to isolate them</li>
                            <li>Prevent the infection from spreading to >70% of nodes</li>
                            <li>Isolate all infected nodes to win</li>
                            <li>⚠️ Infection spreads automatically every 30 seconds</li>
                        </ul>
                    </div>
                    
                    <div style="position: relative; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px;">
                        <canvas id="network-canvas" width="800" height="500" style="
                            border: 2px solid rgba(255,255,255,0.3); border-radius: 4px;
                            cursor: pointer; display: block; margin: 0 auto;
                        "></canvas>
                        
                        <div id="node-info" style="
                            position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.8);
                            padding: 10px; border-radius: 4px; font-size: 12px; max-width: 200px;
                            display: none;
                        ">
                            <div id="node-details"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameHTML);
        
        this.gameCanvas = document.getElementById('network-canvas');
        this.canvasContext = this.gameCanvas.getContext('2d');
        
        // Add canvas event listeners
        this.gameCanvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.gameCanvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        
        this.updateNetworkDisplay();
    }

    updateNetworkDisplay() {
        const ctx = this.canvasContext;
        const canvas = this.gameCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        this.connections.forEach(conn => {
            if (conn.active) {
                const fromNode = this.nodes[conn.from];
                const toNode = this.nodes[conn.to];
                
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const radius = 20;
            let color = '#4CAF50'; // Healthy
            
            if (node.isolated) {
                color = '#FF9800'; // Isolated
            } else if (node.infected) {
                color = '#f44336'; // Infected
            }
            
            // Node circle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Node border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Node icon
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const icon = this.getNodeIcon(node.type);
            ctx.fillText(icon, node.x, node.y);
            
            // Node label
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(node.label, node.x, node.y + radius + 15);
        });
        
        // Update counters
        document.getElementById('infected-count').textContent = this.infectedNodes.length;
        document.getElementById('isolated-count').textContent = this.isolatedNodes.length;
    }

    getNodeIcon(type) {
        const icons = {
            server: '🖥️',
            workstation: '💻',
            router: '📡',
            firewall: '🔥',
            database: '💾'
        };
        return icons[type] || '💻';
    }

    handleCanvasClick(e) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked node
        const clickedNode = this.nodes.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            return Math.sqrt(dx * dx + dy * dy) <= 20;
        });
        
        if (clickedNode && clickedNode.infected && !clickedNode.isolated) {
            this.isolateNode(clickedNode.id);
        }
    }

    handleCanvasHover(e) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find hovered node
        const hoveredNode = this.nodes.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            return Math.sqrt(dx * dx + dy * dy) <= 20;
        });
        
        const nodeInfo = document.getElementById('node-info');
        const nodeDetails = document.getElementById('node-details');
        
        if (hoveredNode) {
            const status = hoveredNode.isolated ? 'ISOLATED' : hoveredNode.infected ? 'INFECTED' : 'HEALTHY';
            const connections = this.getConnectedNodes(hoveredNode.id).length;
            
            nodeDetails.innerHTML = `
                <strong>${hoveredNode.label}</strong><br>
                Type: ${hoveredNode.type}<br>
                Status: ${status}<br>
                Connections: ${connections}
            `;
            
            nodeInfo.style.display = 'block';
            nodeInfo.style.left = (e.clientX - rect.left + 25) + 'px';
            nodeInfo.style.top = (e.clientY - rect.top - 50) + 'px';
        } else {
            nodeInfo.style.display = 'none';
        }
    }

    isolateNode(nodeId) {
        const node = this.nodes[nodeId];
        node.isolated = true;
        
        this.isolatedNodes.push(nodeId);
        this.infectedNodes = this.infectedNodes.filter(id => id !== nodeId);
        
        // Disable connections to isolated node
        this.connections.forEach(conn => {
            if (conn.from === nodeId || conn.to === nodeId) {
                conn.active = false;
            }
        });
        
        this.updateNetworkDisplay();
        this.showIsolationSuccess(node.label);
        
        // Check win condition
        if (this.infectedNodes.length === 0) {
            this.gameOver(true);
        }
    }

    showSpreadAlert(newInfections) {
        this.showNotification(`⚠️ Infection spread to ${newInfections} new nodes!`, '#FF5722');
    }

    showIsolationSuccess(nodeLabel) {
        this.showNotification(`🛡️ ${nodeLabel} isolated successfully!`, '#4CAF50');
    }

    gameOver(won) {
        clearInterval(this.spreadInterval);
        
        const stats = {
            time: Math.floor((Date.now() - this.level.startTime) / 1000),
            nodesIsolated: this.isolatedNodes.length,
            nodesInfected: this.infectedNodes.length,
            perfect: won && this.isolatedNodes.length <= this.level.infectedNodes,
            hintsUsed: 0
        };
        
        if (won) {
            this.showNotification('🎉 Network secured! All infections contained.', '#4CAF50');
            
            // Complete level after delay
            setTimeout(() => {
                if (window.gameProgression) {
                    window.gameProgression.completeLevel(this.level.id, stats);
                }
            }, 2000);
        } else {
            this.showNotification('💀 Network compromised! Too many nodes infected.', '#f44336');
            
            setTimeout(() => {
                this.exitLevel();
            }, 3000);
        }
    }

    exitLevel() {
        this.cleanup();
        const gameScreen = document.getElementById('network-puzzle-game');
        if (gameScreen) gameScreen.remove();
        
        if (window.gameProgression) {
            window.gameProgression.showLevelSelection();
        }
    }

    cleanup() {
        if (this.spreadInterval) {
            clearInterval(this.spreadInterval);
            this.spreadInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
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
        }, 4000);
    }
}

// Initialize network puzzle system
window.networkPuzzle = new NetworkPuzzleSystem();

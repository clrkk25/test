// 游戏主逻辑（最新修复版）
class TexasHoldemGame {
    constructor() {
        this.pokerLogic = new PokerLogic();
        this.aiHelper = new AIHelper(this.pokerLogic);
        this.gameState = {
            currentStage: 'PREFLOP',
            currentPlayerIndex: 0,
            humanPlayerPosition: -1,
            pot: 0,
            currentBet: 0,
            deck: [],
            communityCards: [],
            players: [],
            gameStarted: false,
            lastAction: null
        };
        
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        
        // 页面加载后1秒自动开始游戏
        setTimeout(() => {
            this.startNewGame();
        }, 1000);
    }

    bindElements() {
        // 游戏信息元素
        this.gameStageElement = document.getElementById('gameStage');
        this.potAmountElement = document.getElementById('potAmount');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        
        // 玩家元素
        this.playerElements = [
            document.getElementById('player1'),
            document.getElementById('player2'),
            document.getElementById('player3')
        ];
        
        // 操作按钮
        this.betBtn = document.getElementById('betBtn');
        this.checkBtn = document.getElementById('checkBtn');
        this.callBtn = document.getElementById('callBtn');
        this.raiseBtn = document.getElementById('raiseBtn');
        this.foldBtn = document.getElementById('foldBtn');


        
        // 加注额度选择界面元素
        this.raiseOptionsModal = document.getElementById('raiseOptions');
        this.minRaiseAmountElement = document.getElementById('minRaiseAmount');
        this.tripleRaiseAmountElement = document.getElementById('tripleRaiseAmount');
        this.quintupleRaiseAmountElement = document.getElementById('quintupleRaiseAmount');
        this.cancelRaiseBtn = document.getElementById('cancelRaise');
        
        // 砝码相关元素
        this.betTotalElement = document.getElementById('betTotal');
        this.chipsContainer = document.getElementById('chipsContainer');
        this.chipButtons = document.querySelectorAll('.chip-btn');
        
        // 公共牌区域
        this.communityCardsElement = document.querySelector('.community-cards');
        
        // 日志区域
        this.logMessagesElement = document.getElementById('logMessages');
        
        // 游戏结束显示元素
        this.gameOverDisplay = document.getElementById('gameOverDisplay');
        this.winnerTitle = document.getElementById('winnerTitle');
        this.winnerInfo = document.getElementById('winnerInfo');
        this.playAgainBtn = document.getElementById('playAgain');
        this.backToMenuBtn = document.getElementById('backToMenuFromGame');
        
        // 返回菜单按钮
        this.backToMenuBtn = document.getElementById('backToMenu');
        
        // 砝码数据
        this.selectedChips = [];
    }

    bindEvents() {
        // 操作按钮事件
        this.betBtn?.addEventListener('click', () => this.showBetControls());
        this.checkBtn?.addEventListener('click', () => this.playerAction('CHECK'));
        this.callBtn?.addEventListener('click', () => this.playerAction('CALL'));
        this.raiseBtn?.addEventListener('click', () => this.showRaiseOptions());
        this.foldBtn?.addEventListener('click', () => this.playerAction('FOLD'));

        
        // 砝码按钮事件
        this.chipButtons?.forEach(button => {
            button.addEventListener('click', () => this.addChip(parseInt(button.dataset.value)));
        });
        

        
        // 模态框按钮事件
        this.playAgainBtn?.addEventListener('click', () => this.startNewGame());
        this.backToMenuBtn?.addEventListener('click', () => window.location.href = 'index.html');
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (!this.isHumanTurn()) return;
            
            switch(e.key) {
                case '1': case 'b': this.showBetControls(); break;
                case '2': case 'c': this.playerAction('CHECK'); break;
                case '3': case 'l': this.playerAction('CALL'); break;
                case '4': case 'r': this.showRaiseOptions(); break;
                case '5': case 'f': this.playerAction('FOLD'); break;

                case 'Escape': this.hideBetControls(); break;
            }
        });
    }

    startNewGame() {
        this.resetGameState();
        this.setupPlayers();
        this.dealCards();
        this.startBettingRound();
        this.addLog('游戏开始！按照用户1→用户2→用户3的顺序轮流行动');
        
        // 隐藏新的一局按钮
        this.hideNewGameButton();
    }

    resetGameState() {
        this.gameState = {
            currentStage: 'PREFLOP',
            currentPlayerIndex: 0, // 总是从用户1开始
            humanPlayerPosition: 0, // 固定用户1为人类玩家
            pot: 0,
            currentBet: 0,
            deck: this.pokerLogic.createDeck(),
            communityCards: [],
            players: [],
            gameStarted: true,
            lastAction: null,
            aiTimer: null, // AI操作倒计时
            aiTimeLeft: 3 // AI操作剩余时间
        };
        
        // 重置UI
        this.updateGameInfo();
        this.hideBetControls();
        this.clearCommunityCards();
        this.clearLog();
        this.hideGameOverDisplay();
        
        // 重置玩家UI
        this.playerElements.forEach((element, index) => {
            element.classList.remove('active', 'folded', 'winner');
            const statusElement = element.querySelector('.player-status');
            if (statusElement) statusElement.textContent = '等待中...';
            
            // 重置手牌显示
            const cardElements = element.querySelectorAll('.card');
            cardElements.forEach(card => {
                card.className = 'card back';
                card.removeAttribute('data-rank');
                card.removeAttribute('data-suit');
            });
        });
    }

    setupPlayers() {
        // 从localStorage读取玩家筹码值
        let humanChips = 1000;
        let ai1Chips = 1000;
        let ai2Chips = 1000;
        
        try {
            const savedChips = localStorage.getItem('player_chips');
            if (savedChips) {
                const playerChips = JSON.parse(savedChips);
                humanChips = playerChips.human || 1000;
                ai1Chips = playerChips.ai1 || 1000;
                ai2Chips = playerChips.ai2 || 1000;
            }
        } catch (error) {
            console.log('无法读取玩家筹码数据，使用默认值');
        }
        
        this.gameState.players = [
            {
                name: '玩家1',
                displayName: '您',
                chips: humanChips,
                currentBet: 0,
                cards: [],
                folded: false,
                isHuman: true,
                personality: 'balanced',
                actions: []
            },
            {
                name: '玩家2',
                displayName: 'AI玩家1',
                chips: ai1Chips,
                currentBet: 0,
                cards: [],
                folded: false,
                isHuman: false,
                personality: 'aggressive',
                actions: []
            },
            {
                name: '玩家3',
                displayName: 'AI玩家2',
                chips: ai2Chips,
                currentBet: 0,
                cards: [],
                folded: false,
                isHuman: false,
                personality: 'balanced',
                actions: []
            }
        ];
        
        // 设置底注为$10
        this.gameState.blindAmount = 10;
        
        // 更新玩家名称显示
        this.playerElements.forEach((element, index) => {
            const nameElement = element.querySelector('.player-name');
            if (nameElement) {
                nameElement.textContent = this.gameState.players[index].displayName;
            }
        });
        
        // 扣除底注
        this.gameState.players.forEach(player => {
            player.chips -= 10;
            player.currentBet = 10;
        });
        this.gameState.pot = 30;
        this.gameState.currentBet = 10;
        
        this.updatePlayerDisplays();
    }

    dealCards() {
        // 给每个玩家发两张牌
        for (let i = 0; i < 2; i++) {
            this.gameState.players.forEach(player => {
                if (this.gameState.deck.length > 0) {
                    player.cards.push(this.gameState.deck.pop());
                }
            });
        }
        
        // 更新手牌显示（只显示人类玩家的牌）
        this.gameState.players.forEach((player, index) => {
            if (player.isHuman) {
                this.updatePlayerCardsDisplay(index, player.cards);
            }
        });
    }

    startBettingRound() {
        this.gameState.currentPlayerIndex = 0;
        this.processPlayerTurn();
    }

    processPlayerTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (currentPlayer.folded) {
            this.nextPlayer();
            return;
        }
        
        this.updateActivePlayer();
        
        if (currentPlayer.isHuman) {
            // 人类玩家回合
            this.updateButtonStates(true);
            this.addLog('轮到您行动了');
            this.clearAITimer(); // 清除AI倒计时显示
        } else {
            // CPU玩家回合
            this.updateButtonStates(false);
            this.startAITimer(currentPlayer);
        }
    }

    startAITimer(player) {
        this.clearAITimer(); // 先清除之前的计时器
        
        this.gameState.aiTimeLeft = 3;
        this.gameState.aiTimer = setInterval(() => {
            this.gameState.aiTimeLeft--;
            this.updateAITimerDisplay(player);
            
            if (this.gameState.aiTimeLeft <= 0) {
                this.clearAITimer();
                this.cpuPlayerAction();
            }
        }, 1000);
        
        this.updateAITimerDisplay(player);
    }
    
    updateAITimerDisplay(player) {
        const playerElement = this.playerElements[this.gameState.currentPlayerIndex];
        const statusElement = playerElement.querySelector('.player-status');
        
        if (statusElement) {
            if (this.gameState.aiTimeLeft > 0) {
                statusElement.textContent = '思考中... ' + this.gameState.aiTimeLeft + '秒';
            } else {
                statusElement.textContent = '行动中...';
            }
        }
        
        this.addLog(player.displayName + ' 正在思考... ' + this.gameState.aiTimeLeft + '秒');
    }
    
    clearAITimer() {
        if (this.gameState.aiTimer) {
            clearInterval(this.gameState.aiTimer);
            this.gameState.aiTimer = null;
        }
        
        // 重置状态显示
        this.playerElements.forEach((element, index) => {
            const statusElement = element.querySelector('.player-status');
            if (statusElement && !this.gameState.players[index]?.folded) {
                statusElement.textContent = '等待中...';
            }
        });
    }
    
    cpuPlayerAction() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.folded) return;
        
        const situation = this.aiHelper.evaluateSituation(
            currentPlayer.cards,
            this.gameState.communityCards,
            this.gameState.pot,
            this.gameState.currentBet,
            currentPlayer.chips,
            currentPlayer.actions,
            currentPlayer.personality
        );
        
        const action = this.decideCPUAction(currentPlayer);
        
        if (action === 'BET' || action === 'RAISE') {
            // AI下注金额计算（基于几何与概率模型）
            let betAmount;
            const pFinal = situation.finalProbability;
            
            if (action === 'BET') {
                // 初始下注金额
                if (currentPlayer.personality === 'aggressive') {
                    betAmount = Math.floor(Math.random() * 31) + 20; // 20-50
                } else {
                    betAmount = Math.floor(Math.random() * 11) + 10; // 10-20
                }
            } else { // RAISE
                const currentBet = this.gameState.currentBet;
                
                // 基于最终概率的加注倍数选择
                if (currentPlayer.personality === 'aggressive') {
                    // 激进AI加注倍数
                    if (pFinal > 0.9) {
                        // 5倍或All-in
                        betAmount = Math.random() < 0.7 ? currentBet * 5 : currentPlayer.chips;
                    } else if (pFinal > 0.7) {
                        // 3-5倍
                        betAmount = currentBet * (Math.floor(Math.random() * 3) + 3);
                    } else if (pFinal > 0.5) {
                        // 2-3倍
                        betAmount = currentBet * (Math.floor(Math.random() * 2) + 2);
                    } else if (pFinal > 0.3) {
                        // 最小加注或Bluff
                        betAmount = Math.random() < 0.6 ? currentBet * 2 : currentBet * 3;
                    } else {
                        // Bluff或Fold（这里已经是RAISE，所以选择Bluff）
                        betAmount = currentBet * 2; // 最小加注进行Bluff
                    }
                } else {
                    // 保守AI加注倍数
                    if (pFinal > 0.9) {
                        // 3-5倍
                        betAmount = currentBet * (Math.floor(Math.random() * 3) + 3);
                    } else if (pFinal > 0.7) {
                        // 2-3倍
                        betAmount = currentBet * (Math.floor(Math.random() * 2) + 2);
                    } else if (pFinal > 0.5) {
                        // 最小加注
                        betAmount = currentBet * 2;
                    } else if (pFinal > 0.3) {
                        // 最小加注
                        betAmount = currentBet * 2;
                    } else {
                        // Fold（这里已经是RAISE，所以选择最小加注）
                        betAmount = currentBet * 2;
                    }
                }
                
                // 确保符合最小加注规则
                betAmount = Math.max(betAmount, currentBet * 2);
            }
            
            // 确保为$10的整数倍且不超过玩家筹码
            betAmount = Math.floor(betAmount / 10) * 10;
            betAmount = Math.min(betAmount, currentPlayer.chips);
            
            this.executeAction(action, betAmount);
        } else {
            this.executeAction(action, null);
        }
    }

    decideCPUAction(player) {
        const situation = this.aiHelper.evaluateSituation(
            player.cards,
            this.gameState.communityCards,
            this.gameState.pot,
            this.gameState.currentBet,
            player.chips,
            player.actions,
            player.personality
        );
        
        const callAmount = this.gameState.currentBet - player.currentBet;
        const canCheck = callAmount === 0;
        
        // 弃牌判断
        if (situation.shouldFold) {
            return 'FOLD';
        }
        
        // 根据最终概率和个性决定行动
        const pFinal = situation.finalProbability;
        let action;
        
        if (player.personality === 'aggressive') {
            // 激进AI行为概率映射
            if (pFinal > 0.8) {
                action = Math.random() < 0.7 ? 'RAISE' : 'BET';
            } else if (pFinal > 0.6) {
                const rand = Math.random();
                if (rand < 0.5) action = 'RAISE';
                else if (rand < 0.8) action = 'BET';
                else action = 'CALL';
            } else if (pFinal > 0.4) {
                const rand = Math.random();
                if (rand < 0.4) action = 'BET';
                else if (rand < 0.7) action = 'CALL';
                else action = 'RAISE';
            } else if (pFinal > 0.2) {
                const rand = Math.random();
                if (rand < 0.5) action = 'RAISE'; // Bluff Raise
                else if (rand < 0.8) action = 'CALL';
                else action = 'FOLD';
            } else {
                const rand = Math.random();
                if (rand < 0.4) action = 'RAISE'; // Bluff Raise
                else if (rand < 0.8) action = 'FOLD';
                else action = 'CALL';
            }
        } else {
            // 保守AI行为概率映射
            if (pFinal > 0.8) {
                const rand = Math.random();
                if (rand < 0.5) action = 'BET';
                else if (rand < 0.8) action = 'RAISE';
                else action = 'CHECK';
            } else if (pFinal > 0.6) {
                const rand = Math.random();
                if (rand < 0.6) action = 'CALL';
                else if (rand < 0.9) action = 'CHECK';
                else action = 'BET';
            } else if (pFinal > 0.4) {
                const rand = Math.random();
                if (rand < 0.7) action = 'CALL';
                else if (rand < 0.9) action = 'CHECK';
                else action = 'FOLD';
            } else if (pFinal > 0.2) {
                const rand = Math.random();
                if (rand < 0.6) action = 'FOLD';
                else action = 'CALL';
            } else {
                const rand = Math.random();
                if (rand < 0.8) action = 'FOLD';
                else action = 'CALL';
            }
        }
        
        // 确保行动合法
        if (action === 'CHECK' && !canCheck) {
            action = 'CALL';
        }
        
        if (action === 'BET' && this.gameState.currentBet > 0) {
            action = 'RAISE';
        }
        
        return action;
    }

    playerAction(action) {
        if (!this.isHumanTurn()) return;
        
        if (action === 'BET') {
            this.showBetControls();
            return;
        }
        
        if (action === 'RAISE') {
            this.showRaiseOptions();
            return;
        }
        
        this.executeAction(action, null);
    }

    executeAction(action, betAmount) {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        if (!currentPlayer) return;
        
        let amount = 0;
        let message = '';
        
        switch (action) {
            case 'FOLD':
                currentPlayer.folded = true;
                message = currentPlayer.name + ' 弃牌';
                break;
                
            case 'CHECK':
                message = currentPlayer.name + ' 过牌';
                break;
                
            case 'CALL':
                amount = this.gameState.currentBet - currentPlayer.currentBet;
                if (amount > currentPlayer.chips) {
                    amount = currentPlayer.chips; // All-in
                }
                currentPlayer.chips -= amount;
                currentPlayer.currentBet += amount;
                this.gameState.pot += amount;
                message = currentPlayer.name + ' 跟注 ' + amount + '筹码';
                break;
                
            case 'BET':
            case 'RAISE':
                amount = betAmount || 50;
                if (action === 'RAISE') {
                    amount += this.gameState.currentBet - currentPlayer.currentBet;
                }
                
                if (amount > currentPlayer.chips) {
                    amount = currentPlayer.chips; // All-in
                }
                
                currentPlayer.chips -= amount;
                currentPlayer.currentBet += amount;
                this.gameState.pot += amount;
                this.gameState.currentBet = currentPlayer.currentBet;
                
                message = currentPlayer.name + (action === 'BET' ? ' 下注 ' : ' 加注 ') + amount + '筹码';
                break;
        }
        
        // 记录行动
        currentPlayer.actions.push(action);
        this.gameState.lastAction = action;
        
        this.addLog(message);
        this.updateGameInfo();
        this.updatePlayerDisplays();
        this.hideBetControls();
        
        // 检查回合是否结束
        if (this.isBettingRoundComplete()) {
            this.advanceToNextStage();
        } else {
            this.nextPlayer();
            
            // 如果下一个玩家是AI，立即开始AI思考
            const nextPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            if (!nextPlayer.isHuman && !nextPlayer.folded) {
                this.startAITimer(nextPlayer);
            }
        }
    }



    nextPlayer() {
        // 按照用户1→用户2→用户3的顺序轮流行动
        let nextIndex = (this.gameState.currentPlayerIndex + 1) % 3;
        
        // 如果下一个玩家已弃牌，继续寻找下一个未弃牌的玩家
        while (this.gameState.players[nextIndex].folded && !this.isBettingRoundComplete()) {
            nextIndex = (nextIndex + 1) % 3;
            
            // 防止无限循环
            if (nextIndex === this.gameState.currentPlayerIndex) {
                break;
            }
        }
        
        this.gameState.currentPlayerIndex = nextIndex;
        
        // 如果所有玩家都弃牌或行动完成，结束回合
        if (this.isBettingRoundComplete()) {
            this.advanceToNextStage();
        } else {
            this.processPlayerTurn();
        }
    }

    isBettingRoundComplete() {
        const activePlayers = this.gameState.players.filter(p => !p.folded);
        
        if (activePlayers.length <= 1) {
            return true; // 只剩一个玩家，直接获胜
        }
        
        // 检查所有活跃玩家是否都跟注了当前下注
        const allCalled = activePlayers.every(player => 
            player.currentBet === this.gameState.currentBet
        );
        
        // 检查是否所有玩家都行动过一轮
        const lastActionPlayer = this.gameState.lastAction ? 
            this.gameState.players.find(p => p.actions.length > 0 && 
                p.actions[p.actions.length - 1] === this.gameState.lastAction) : null;
        
        return allCalled && lastActionPlayer && 
            this.gameState.players.indexOf(lastActionPlayer) === this.gameState.currentPlayerIndex;
    }

    advanceToNextStage() {
        switch (this.gameState.currentStage) {
            case 'PREFLOP':
                this.gameState.currentStage = 'FLOP';
                this.dealCommunityCards(3);
                this.addLog('翻牌阶段：发出3张公共牌');
                break;
                
            case 'FLOP':
                this.gameState.currentStage = 'TURN';
                this.dealCommunityCards(1);
                this.addLog('转牌阶段：发出第4张公共牌');
                break;
                
            case 'TURN':
                this.gameState.currentStage = 'RIVER';
                this.dealCommunityCards(1);
                this.addLog('河牌阶段：发出第5张公共牌');
                break;
                
            case 'RIVER':
                this.gameState.currentStage = 'SHOWDOWN';
                this.determineWinner();
                return; // 游戏结束
        }
        
        // 重置当前下注，开始新一轮下注
        this.gameState.currentBet = 0;
        this.gameState.players.forEach(player => {
            player.currentBet = 0;
        });
        
        this.updateGameInfo();
        this.startBettingRound();
    }

    dealCommunityCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.gameState.deck.length > 0) {
                this.gameState.communityCards.push(this.gameState.deck.pop());
            }
        }
        this.updateCommunityCardsDisplay();
    }

    determineWinner() {
        const activePlayers = this.gameState.players.filter(p => !p.folded);
        
        if (activePlayers.length === 1) {
            // 只有一个玩家未弃牌，直接获胜
            this.declareWinner(activePlayers[0], '所有对手弃牌');
            return;
        }
        
        // 比较所有活跃玩家的牌型
        let winners = [];
        let bestHand = null;
        
        for (let player of activePlayers) {
            const allCards = [...player.cards, ...this.gameState.communityCards];
            const handScore = this.pokerLogic.evaluateHand(allCards);
            
            if (!handScore) continue;
            
            if (!bestHand || this.pokerLogic.compareHands(handScore, bestHand) > 0) {
                bestHand = handScore;
                winners = [player];
            } else if (this.pokerLogic.compareHands(handScore, bestHand) === 0) {
                winners.push(player);
            }
        }
        
        if (winners.length === 1) {
            this.declareWinner(winners[0], bestHand.name);
        } else {
            this.declareTie(winners, bestHand.name);
        }
    }

    declareWinner(player, handType) {
        player.chips += this.gameState.pot;
        
        const playerIndex = this.gameState.players.indexOf(player);
        this.playerElements[playerIndex].classList.add('winner');
        
        // 显示所有玩家的牌
        this.gameState.players.forEach((p, index) => {
            this.updatePlayerCardsDisplay(index, p.cards);
        });
        
        const winnerText = player.isHuman ? '恭喜您获胜！' : player.displayName + ' 获胜！';
        const resultMessage = winnerText + ' 赢得 ' + this.gameState.pot + ' 筹码，牌型：' + handType;
        
        // 直接在通知栏显示结果
        this.addLog(resultMessage);
        
        // 显示新的一局按钮
        this.showNewGameButton(resultMessage);
        
        // 保存游戏统计和玩家筹码
        this.savePlayerChips();
        if (player.isHuman) {
            this.saveGameStats('win');
        }
    }

    declareTie(players, handType) {
        const potPerPlayer = Math.floor(this.gameState.pot / players.length);
        
        players.forEach(player => {
            player.chips += potPerPlayer;
            const playerIndex = this.gameState.players.indexOf(player);
            this.playerElements[playerIndex].classList.add('winner');
        });
        
        const playerNames = players.map(p => p.displayName).join('、');
        const resultMessage = '平局！' + playerNames + ' 平分底池，各得 ' + potPerPlayer + ' 筹码，牌型：' + handType;
        
        // 直接在通知栏显示结果
        this.addLog(resultMessage);
        
        // 显示新的一局按钮
        this.showNewGameButton(resultMessage);
        
        // 保存玩家筹码
        this.savePlayerChips();
    }

    // UI更新方法
    updateGameInfo() {
        if (this.gameStageElement) {
            const stageNames = {
                'PREFLOP': '翻牌前',
                'FLOP': '翻牌',
                'TURN': '转牌',
                'RIVER': '河牌',
                'SHOWDOWN': '摊牌'
            };
            this.gameStageElement.textContent = stageNames[this.gameState.currentStage] || this.gameState.currentStage;
        }
        
        if (this.potAmountElement) {
            this.potAmountElement.textContent = '底池: ' + this.gameState.pot;
        }
        
        if (this.currentPlayerElement) {
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            this.currentPlayerElement.textContent = '当前玩家: ' + 
                (currentPlayer?.displayName || currentPlayer?.name);
        }
    }

    updateActivePlayer() {
        this.playerElements.forEach((element, index) => {
            element.classList.remove('active');
            if (index === this.gameState.currentPlayerIndex) {
                element.classList.add('active');
            }
            
            if (this.gameState.players[index]?.folded) {
                element.classList.add('folded');
            }
        });
    }

    updatePlayerDisplays() {
        this.gameState.players.forEach((player, index) => {
            const element = this.playerElements[index];
            if (!element) return;
            
            const chipsElement = element.querySelector('.player-chips');
            const betElement = element.querySelector('.player-bet');
            const statusElement = element.querySelector('.player-status');
            
            if (chipsElement) chipsElement.textContent = '筹码: ' + player.chips;
            if (betElement) betElement.textContent = '下注: ' + player.currentBet;
            
            if (statusElement) {
                if (player.folded) {
                    statusElement.textContent = '已弃牌';
                } else if (index === this.gameState.currentPlayerIndex) {
                    statusElement.textContent = '行动中...';
                } else {
                    statusElement.textContent = '等待中...';
                }
            }
        });
    }

    updatePlayerCardsDisplay(playerIndex, cards) {
        const element = this.playerElements[playerIndex];
        if (!element) return;
        
        const cardElements = element.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            if (cardElements[index]) {
                const cardElement = cardElements[index];
                cardElement.className = `card front ${card.color} dealing`;
                cardElement.setAttribute('data-rank', card.rank);
                cardElement.setAttribute('data-suit', card.suit);
                cardElement.textContent = card.rank + card.suit;
                
                // 移除动画类
                setTimeout(() => {
                    cardElement.classList.remove('dealing');
                }, 500);
            }
        });
    }

    updateCommunityCardsDisplay() {
        if (!this.communityCardsElement) return;
        
        // 清空现有显示
        this.communityCardsElement.innerHTML = '';
        
        // 创建新的牌显示
        this.gameState.communityCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card front ${card.color} dealing`;
            cardElement.setAttribute('data-rank', card.rank);
            cardElement.setAttribute('data-suit', card.suit);
            cardElement.textContent = card.rank + card.suit;
            this.communityCardsElement.appendChild(cardElement);
            
            // 移除动画类
            setTimeout(() => {
                cardElement.classList.remove('dealing');
            }, 500);
        });
        
        // 添加占位符
        const remainingCards = 5 - this.gameState.communityCards.length;
        for (let i = 0; i < remainingCards; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'card-placeholder';
            placeholder.textContent = ['Flop', 'Flop', 'Flop', 'Turn', 'River'][i];
            this.communityCardsElement.appendChild(placeholder);
        }
    }

    clearCommunityCards() {
        if (this.communityCardsElement) {
            this.communityCardsElement.innerHTML = '';
            
            // 添加5个占位符
            for (let i = 0; i < 5; i++) {
                const placeholder = document.createElement('div');
                placeholder.className = 'card-placeholder';
                placeholder.textContent = ['Flop', 'Flop', 'Flop', 'Turn', 'River'][i];
                this.communityCardsElement.appendChild(placeholder);
            }
        }
    }

    updateButtonStates(isHumanTurn) {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.folded) {
            isHumanTurn = false;
        }
        
        const callAmount = this.gameState.currentBet - currentPlayer.currentBet;
        const canCheck = callAmount === 0;
        
        // 情况1：无人下注时显示 [Check] [Bet] [Fold]
        // 情况2：有人下注时显示 [Call $X] [Raise] [Fold]
        if (canCheck) {
            // 无人下注或已跟注
            if (this.betBtn) this.betBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            if (this.checkBtn) this.checkBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            if (this.callBtn) this.callBtn.style.display = 'none';
            if (this.raiseBtn) this.raiseBtn.style.display = 'none';
        } else {
            // 有人下注，需要跟注
            if (this.betBtn) this.betBtn.style.display = 'none';
            if (this.checkBtn) this.checkBtn.style.display = 'none';
            if (this.callBtn) this.callBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            if (this.raiseBtn) this.raiseBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            
            // 更新跟注金额显示
            if (this.callBtn) {
                this.callBtn.textContent = '跟注 (' + callAmount + ')';
            }
        }
        
        if (this.foldBtn) this.foldBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
        
        // 禁用非人类玩家按钮
        if (!isHumanTurn) {
            if (this.betBtn) this.betBtn.disabled = true;
            if (this.checkBtn) this.checkBtn.disabled = true;
            if (this.callBtn) this.callBtn.disabled = true;
            if (this.raiseBtn) this.raiseBtn.disabled = true;
            if (this.foldBtn) this.foldBtn.disabled = true;
        } else {
            if (this.betBtn) this.betBtn.disabled = false;
            if (this.checkBtn) this.checkBtn.disabled = false;
            if (this.callBtn) this.callBtn.disabled = false;
            if (this.raiseBtn) this.raiseBtn.disabled = false;
            if (this.foldBtn) this.foldBtn.disabled = false;
        }
    }

    showBetControls() {
        if (!this.isHumanTurn()) return;
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const minBet = this.gameState.currentBet > 0 ? 
            (this.gameState.currentBet - currentPlayer.currentBet) * 2 : 10;
        
        // 检查是否有砝码被选择
        const totalBet = this.selectedChips.reduce((sum, chip) => sum + chip, 0);
        
        if (totalBet === 0) {
            this.addLog('请先选择砝码金额，然后点击下注按钮');
            return;
        }
        
        // 检查下注金额是否符合规则
        if (totalBet < minBet) {
            this.addLog('下注金额 ' + totalBet + ' 小于最小下注额 ' + minBet + '，请重新选择砝码');
            return;
        }
        
        if (totalBet > currentPlayer.chips) {
            this.addLog('下注金额 ' + totalBet + ' 超过您的筹码 ' + currentPlayer.chips + '，请重新选择砝码');
            return;
        }
        
        // 执行下注操作
        this.executeAction('BET', totalBet);
    }
    
    showRaiseOptions() {
         if (!this.isHumanTurn()) return;
         
         const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
         const currentBet = this.gameState.currentBet;
         const playerBet = currentPlayer.currentBet;
         const callAmount = currentBet - playerBet;
         
         // 检查是否有砝码被选择
         const totalBet = this.selectedChips.reduce((sum, chip) => sum + chip, 0);
         
         if (totalBet === 0) {
             this.addLog('请先选择砝码金额，然后点击加注按钮');
             return;
         }
         
         // 计算最小加注金额（当前下注额的2倍）
         const minRaise = currentBet * 2;
         
         // 检查加注金额是否符合规则
         const raiseAmount = totalBet + callAmount;
         
         if (raiseAmount < minRaise) {
             this.addLog('加注金额 ' + raiseAmount + ' 小于最小加注额 ' + minRaise + '，请重新选择砝码');
             return;
         }
         
         if (raiseAmount > currentPlayer.chips) {
             this.addLog('加注金额 ' + raiseAmount + ' 超过您的筹码 ' + currentPlayer.chips + '，请重新选择砝码');
             return;
         }
         
         // 执行加注操作
         this.executeAction('RAISE', totalBet);
     }
     
     // 加注选项界面已移除，改为使用砝码选择方式

    hideBetControls() {
        // 清空砝码显示
        this.clearChips();
    }

    addLog(message) {
        if (!this.logMessagesElement) return;
        
        const logEntry = document.createElement('div');
        logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
        this.logMessagesElement.appendChild(logEntry);
        
        // 自动滚动到底部
        this.logMessagesElement.scrollTop = this.logMessagesElement.scrollHeight;
        
        // 限制日志数量
        if (this.logMessagesElement.children.length > 50) {
            this.logMessagesElement.removeChild(this.logMessagesElement.firstChild);
        }
    }

    clearLog() {
        if (this.logMessagesElement) {
            this.logMessagesElement.innerHTML = '<div>游戏即将开始...</div>';
        }
    }

    showNewGameButton(message) {
        // 创建或显示新的一局按钮
        if (!this.newGameButton) {
            this.newGameButton = document.createElement('button');
            this.newGameButton.id = 'newGameBtn';
            this.newGameButton.className = 'new-game-btn';
            this.newGameButton.textContent = '新的一局';
            this.newGameButton.addEventListener('click', () => this.startNewGame());
            
            // 将按钮添加到操作区域
            const gameControls = document.querySelector('.game-controls');
            if (gameControls) {
                gameControls.appendChild(this.newGameButton);
            }
        }
        
        // 显示按钮
        this.newGameButton.style.display = 'block';
        
        // 禁用其他操作按钮
        this.disableActionButtons();
        
        // 隐藏原来的游戏结束弹窗
        this.hideGameOverDisplay();
        
        // 在通知栏显示结果
        this.addLog('游戏结束：' + message);
    }

    hideNewGameButton() {
        if (this.newGameButton) {
            this.newGameButton.style.display = 'none';
        }
        
        // 重新启用操作按钮
        this.enableActionButtons();
    }

    disableActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.disabled = true;
        });
    }

    enableActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.disabled = false;
        });
    }

    showGameOverDisplay(message) {
        if (this.winnerTitle && this.winnerInfo) {
            this.winnerTitle.textContent = '游戏结束';
            this.winnerInfo.innerHTML = message;
        }
        
        if (this.gameOverDisplay) {
            this.gameOverDisplay.classList.remove('hidden');
        }
    }

    hideGameOverDisplay() {
        if (this.gameOverDisplay) {
            this.gameOverDisplay.classList.add('hidden');
        }
    }

    savePlayerChips() {
        try {
            const playerChips = {
                human: this.gameState.players[0].chips,
                ai1: this.gameState.players[1].chips,
                ai2: this.gameState.players[2].chips
            };
            localStorage.setItem('player_chips', JSON.stringify(playerChips));
        } catch (error) {
            console.log('无法保存玩家筹码数据');
        }
    }

    // 工具方法
    isHumanTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        return currentPlayer && currentPlayer.isHuman && !currentPlayer.folded;
    }

    saveGameStats(result) {
        try {
            let stats = JSON.parse(localStorage.getItem('poker_stats') || '{}');
            stats.totalGames = (stats.totalGames || 0) + 1;
            if (result === 'win') {
                stats.wins = (stats.wins || 0) + 1;
            }
            stats.winRate = stats.wins / stats.totalGames;
            localStorage.setItem('poker_stats', JSON.stringify(stats));
        } catch (error) {
            console.log('无法保存游戏统计数据');
        }
    }

    // 砝码相关方法
    addChip(value) {
        if (!this.isHumanTurn()) return;
        
        this.selectedChips.push(value);
        this.updateChipsDisplay();
    }

    removeChip(index) {
        if (!this.isHumanTurn()) return;
        
        this.selectedChips.splice(index, 1);
        this.updateChipsDisplay();
    }

    updateChipsDisplay() {
        if (!this.chipsContainer || !this.betTotalElement) return;
        
        // 计算总额
        const total = this.selectedChips.reduce((sum, chip) => sum + chip, 0);
        this.betTotalElement.textContent = total;
        
        // 更新砝码显示
        this.chipsContainer.innerHTML = '';
        
        this.selectedChips.forEach((chip, index) => {
            const chipElement = document.createElement('div');
            chipElement.className = `chip chip-${chip}`;
            chipElement.textContent = chip;
            chipElement.addEventListener('click', () => this.removeChip(index));
            this.chipsContainer.appendChild(chipElement);
        });
    }

    clearChips() {
        this.selectedChips = [];
        this.updateChipsDisplay();
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new TexasHoldemGame();
});
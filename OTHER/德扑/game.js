// 游戏主逻辑（重新实现下注逻辑版）
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
        
        setTimeout(() => {
            this.startNewGame();
        }, 1000);
    }

    bindElements() {
        this.gameStageElement = document.getElementById('gameStage');
        this.potAmountElement = document.getElementById('potAmount');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        
        this.playerElements = [
            document.getElementById('player1'),
            document.getElementById('player2'),
            document.getElementById('player3')
        ];
        
        this.checkBtn = document.getElementById('checkBtn');
        this.callBtn = document.getElementById('callBtn');
        this.allInBtn = document.getElementById('allInBtn');
        this.foldBtn = document.getElementById('foldBtn');
        this.betBtn = document.getElementById('betBtn');
        this.raiseBtn = document.getElementById('raiseBtn');
        this.cancelBetBtn = document.getElementById('cancelBetBtn');
        this.betInputSection = document.querySelector('.bet-input-section');
        this.betAmountInput = document.getElementById('betAmountInput');
        
        this.raiseOptionsModal = document.getElementById('raiseOptions');
        this.minRaiseAmountElement = document.getElementById('minRaiseAmount');
        this.tripleRaiseAmountElement = document.getElementById('tripleRaiseAmount');
        this.quintupleRaiseAmountElement = document.getElementById('quintupleRaiseAmount');
        this.cancelRaiseBtn = document.getElementById('cancelRaise');
        
        this.betTotalElement = document.getElementById('betTotal');
        this.chipsContainer = document.getElementById('chipsContainer');
        this.chipButtons = document.querySelectorAll('.chip-btn');
        
        this.communityCardsElement = document.querySelector('.community-cards');
        
        this.logMessagesElement = document.getElementById('logMessages');
        
        this.gameOverDisplay = document.getElementById('gameOverDisplay');
        this.winnerTitle = document.getElementById('winnerTitle');
        this.winnerInfo = document.getElementById('winnerInfo');
        this.playAgainBtn = document.getElementById('playAgain');
        this.backToMenuBtn = document.getElementById('backToMenuFromGame');
        
        this.backToMenuBtn = document.getElementById('backToMenu');
        
        this.selectedChips = [];
    }

    bindEvents() {
        this.checkBtn?.addEventListener('click', () => this.playerAction('CHECK'));
        this.callBtn?.addEventListener('click', () => this.playerAction('CALL'));
        this.allInBtn?.addEventListener('click', () => this.playerAction('ALL-IN'));
        this.foldBtn?.addEventListener('click', () => this.playerAction('FOLD'));
        this.betBtn?.addEventListener('click', () => this.executeBet());
        this.raiseBtn?.addEventListener('click', () => this.executeRaise());
        this.cancelBetBtn?.addEventListener('click', () => this.hideBetInputSection());
        
        this.playAgainBtn?.addEventListener('click', () => this.startNewGame());
        this.backToMenuBtn?.addEventListener('click', () => window.location.href = 'index.html');
        
        document.addEventListener('keydown', (e) => {
            if (!this.isHumanTurn()) return;
            
            switch(e.key) {
                case '1': case 'c': this.playerAction('CHECK'); break;
                case '2': case 'l': this.playerAction('CALL'); break;
                case '3': case 'a': this.playerAction('ALL-IN'); break;
                case '4': case 'f': this.playerAction('FOLD'); break;
                case 'Escape': this.hideBetInputSection(); break;
            }
        });
    }

    startNewGame() {
        this.resetGameState();
        this.setupPlayers();
        this.dealCards();
        this.startBettingRound();
        this.addLog('游戏开始！按照用户1→用户2→用户3的顺序轮流行动');
        this.updateGameInfo();
        this.updatePlayerDisplays();
        this.hideNewGameButton();
    }

    resetGameState() {
        this.gameState = {
            currentStage: 'PREFLOP',
            currentPlayerIndex: 0,
            humanPlayerPosition: 0,
            pot: 0,
            currentBet: 0,
            deck: this.pokerLogic.createDeck(),
            communityCards: [],
            players: [],
            gameStarted: true,
            lastAction: null,
            aiTimer: null,
            aiTimeLeft: 3,
            bettingRoundData: null
        };
        
        this.hideBetControls();
        this.clearCommunityCards();
        this.clearLog();
        this.hideGameOverDisplay();
        
        this.playerElements.forEach((element, index) => {
            element.classList.remove('active', 'folded', 'winner');
            const statusElement = element.querySelector('.player-status');
            if (statusElement) statusElement.textContent = '等待中...';
            
            const cardElements = element.querySelectorAll('.card');
            cardElements.forEach(card => {
                card.className = 'card back';
                card.removeAttribute('data-rank');
                card.removeAttribute('data-suit');
            });
        });
    }

    setupPlayers() {
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
                allIn: false,
                isHuman: true,
                personality: 'balanced',
                actions: [],
                hasActedThisRound: false
            },
            {
                name: '玩家2',
                displayName: 'AI玩家1',
                chips: ai1Chips,
                currentBet: 0,
                cards: [],
                folded: false,
                allIn: false,
                isHuman: false,
                personality: 'aggressive',
                actions: [],
                hasActedThisRound: false
            },
            {
                name: '玩家3',
                displayName: 'AI玩家2',
                chips: ai2Chips,
                currentBet: 0,
                cards: [],
                folded: false,
                allIn: false,
                isHuman: false,
                personality: 'balanced',
                actions: [],
                hasActedThisRound: false
            }
        ];
        
        this.gameState.blindAmount = 10;
        
        this.playerElements.forEach((element, index) => {
            const nameElement = element.querySelector('.player-name');
            if (nameElement) {
                nameElement.textContent = this.gameState.players[index].displayName;
            }
        });
        
        this.gameState.players.forEach(player => {
            player.chips -= 10;
            player.currentBet = 10;
        });
        this.gameState.pot = 30;
        this.gameState.currentBet = 10;
        this.gameState.bettingRoundData = {
            lastRaiserIndex: 0,
            playersToAct: new Set(),
            minRaise: 10
        };
        
        this.updatePlayerDisplays();
    }

    dealCards() {
        for (let i = 0; i < 2; i++) {
            this.gameState.players.forEach(player => {
                if (this.gameState.deck.length > 0) {
                    player.cards.push(this.gameState.deck.pop());
                }
            });
        }
        
        this.gameState.players.forEach((player, index) => {
            if (player.isHuman) {
                this.updatePlayerCardsDisplay(index, player.cards);
            }
        });
    }

    startBettingRound() {
        this.gameState.bettingRoundData = {
            lastRaiserIndex: -1,
            playersToAct: new Set(),
            minRaise: this.gameState.blindAmount
        };
        
        const activePlayers = this.getActivePlayers();
        activePlayers.forEach(player => {
            const index = this.gameState.players.indexOf(player);
            this.gameState.players[index].hasActedThisRound = false;
            this.gameState.bettingRoundData.playersToAct.add(index);
        });
        
        if (this.gameState.currentStage === 'PREFLOP') {
            this.gameState.currentPlayerIndex = 0;
        } else {
            this.gameState.currentPlayerIndex = this.getFirstActivePlayerIndex();
        }
        
        this.updateGameInfo();
        this.processPlayerTurn();
    }

    processPlayerTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (currentPlayer.folded || currentPlayer.allIn) {
            this.nextPlayer();
            return;
        }
        
        this.updateActivePlayer();
        
        if (currentPlayer.isHuman) {
            this.updateButtonStates(true);
            this.addLog('轮到您行动了');
            this.clearAITimer();
        } else {
            this.updateButtonStates(false);
            this.startAITimer(currentPlayer);
        }
    }

    startAITimer(player) {
        this.clearAITimer();
        
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
        
        this.playerElements.forEach((element, index) => {
            const statusElement = element.querySelector('.player-status');
            if (statusElement && !this.gameState.players[index]?.folded) {
                statusElement.textContent = '等待中...';
            }
        });
    }
    
    cpuPlayerAction() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.folded || currentPlayer.allIn) return;
        
        const situation = this.aiHelper.evaluateSituation(
            currentPlayer.cards,
            this.gameState.communityCards,
            this.gameState.pot,
            this.gameState.currentBet,
            currentPlayer.chips,
            currentPlayer.actions,
            currentPlayer.personality
        );
        
        const action = this.decideCPUAction(currentPlayer, situation);
        
        if (action === 'BET' || action === 'RAISE') {
            let betAmount;
            const pFinal = situation.finalProbability;
            
            if (action === 'BET') {
                if (currentPlayer.personality === 'aggressive') {
                    betAmount = Math.floor(Math.random() * 31) + 20;
                } else {
                    betAmount = Math.floor(Math.random() * 11) + 10;
                }
            } else {
                const currentBet = this.gameState.currentBet;
                const minRaise = this.gameState.bettingRoundData.minRaise;
                
                if (currentPlayer.personality === 'aggressive') {
                    if (pFinal > 0.9) {
                        betAmount = Math.random() < 0.7 ? currentBet * 5 : currentPlayer.chips;
                    } else if (pFinal > 0.7) {
                        betAmount = currentBet * (Math.floor(Math.random() * 3) + 3);
                    } else if (pFinal > 0.5) {
                        betAmount = currentBet * (Math.floor(Math.random() * 2) + 2);
                    } else if (pFinal > 0.3) {
                        betAmount = Math.random() < 0.6 ? currentBet * 2 : currentBet * 3;
                    } else {
                        betAmount = currentBet * 2;
                    }
                } else {
                    if (pFinal > 0.9) {
                        betAmount = currentBet * (Math.floor(Math.random() * 3) + 3);
                    } else if (pFinal > 0.7) {
                        betAmount = currentBet * (Math.floor(Math.random() * 2) + 2);
                    } else if (pFinal > 0.5) {
                        betAmount = currentBet * 2;
                    } else if (pFinal > 0.3) {
                        betAmount = currentBet * 2;
                    } else {
                        betAmount = currentBet * 2;
                    }
                }
                
                betAmount = Math.max(betAmount, currentBet + minRaise);
            }
            
            betAmount = Math.floor(betAmount / 10) * 10;
            betAmount = Math.min(betAmount, currentPlayer.chips);
            
            this.executeAction(action, betAmount);
        } else {
            this.executeAction(action, null);
        }
    }

    decideCPUAction(player, situation) {
        const callAmount = this.gameState.currentBet - player.currentBet;
        const canCheck = callAmount === 0;
        
        if (situation.shouldFold && !canCheck) {
            return 'FOLD';
        }
        
        const pFinal = situation.finalProbability;
        let action;
        
        if (player.personality === 'aggressive') {
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
                if (rand < 0.5) action = 'RAISE';
                else if (rand < 0.8) action = 'CALL';
                else action = 'FOLD';
            } else {
                const rand = Math.random();
                if (rand < 0.4) action = 'RAISE';
                else if (rand < 0.8) action = 'FOLD';
                else action = 'CALL';
            }
        } else {
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
        
        if (action === 'CHECK' && !canCheck) {
            action = 'CALL';
        }
        
        if (action === 'BET' && this.gameState.currentBet > 0) {
            action = 'RAISE';
        }
        
        if ((action === 'BET' || action === 'RAISE') && player.chips <= 0) {
            action = canCheck ? 'CHECK' : 'CALL';
        }
        
        return action;
    }

    playerAction(action) {
        if (!this.isHumanTurn()) return;
        
        if (action === 'ALL-IN') {
            this.executeAllIn();
            return;
        }
        
        this.executeAction(action, null);
    }
    
    executeAllIn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const allInAmount = currentPlayer.chips;
        
        if (allInAmount === 0) {
            this.addLog('您已经没有筹码了');
            return;
        }
        
        const totalBet = currentPlayer.currentBet + allInAmount;
        const maxBet = this.gameState.currentBet;
        
        if (totalBet > maxBet) {
            this.gameState.bettingRoundData.minRaise = Math.max(
                this.gameState.bettingRoundData.minRaise,
                totalBet - maxBet
            );
        }
        
        this.executeAction('ALL-IN', allInAmount);
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
                    amount = currentPlayer.chips;
                }
                currentPlayer.chips -= amount;
                currentPlayer.currentBet += amount;
                this.gameState.pot += amount;
                message = currentPlayer.name + ' 跟注 ' + amount + '筹码';
                
                if (currentPlayer.chips === 0) {
                    currentPlayer.allIn = true;
                    message += ' (ALL-IN)';
                }
                break;
                
            case 'BET':
            case 'RAISE':
            case 'ALL-IN':
                amount = betAmount || 50;
                
                if (amount > currentPlayer.chips) {
                    amount = currentPlayer.chips;
                }
                
                currentPlayer.chips -= amount;
                currentPlayer.currentBet += amount;
                this.gameState.pot += amount;
                
                if (currentPlayer.currentBet > this.gameState.currentBet) {
                    const raiseDiff = currentPlayer.currentBet - this.gameState.currentBet;
                    this.gameState.bettingRoundData.minRaise = Math.max(
                        this.gameState.bettingRoundData.minRaise,
                        raiseDiff
                    );
                    this.gameState.currentBet = currentPlayer.currentBet;
                    this.gameState.bettingRoundData.lastRaiserIndex = this.gameState.currentPlayerIndex;
                    
                    this.resetPlayersToAct();
                }
                
                if (action === 'ALL-IN') {
                    message = currentPlayer.name + ' ALL-IN ' + amount + '筹码';
                } else {
                    message = currentPlayer.name + (action === 'BET' ? ' 下注 ' : ' 加注 ') + amount + '筹码';
                }
                
                if (currentPlayer.chips === 0) {
                    currentPlayer.allIn = true;
                    if (action !== 'ALL-IN') {
                        message += ' (ALL-IN)';
                    }
                }
                break;
        }
        
        currentPlayer.actions.push(action);
        currentPlayer.hasActedThisRound = true;
        this.gameState.lastAction = action;
        this.gameState.bettingRoundData.playersToAct.delete(this.gameState.currentPlayerIndex);
        
        this.addLog(message);
        this.updateGameInfo();
        this.updatePlayerDisplays();
        this.hideBetInputSection();
        
        if (this.isBettingRoundComplete()) {
            this.advanceToNextStage();
        } else {
            this.nextPlayer();
            
            const nextPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            if (!nextPlayer.isHuman && !nextPlayer.folded && !nextPlayer.allIn) {
                this.startAITimer(nextPlayer);
            }
        }
    }

    resetPlayersToAct() {
        const activePlayers = this.getActivePlayers();
        this.gameState.bettingRoundData.playersToAct = new Set();
        
        activePlayers.forEach(player => {
            if (!player.allIn) {
                const index = this.gameState.players.indexOf(player);
                this.gameState.bettingRoundData.playersToAct.add(index);
            }
        });
        
        const currentIndex = this.gameState.currentPlayerIndex;
        this.gameState.bettingRoundData.playersToAct.delete(currentIndex);
    }

    nextPlayer() {
        const nextIndex = this.getNextActivePlayerIndex(this.gameState.currentPlayerIndex);
        
        if (nextIndex === -1) {
            this.advanceToNextStage();
            return;
        }
        
        this.gameState.currentPlayerIndex = nextIndex;
        
        if (this.isBettingRoundComplete()) {
            this.advanceToNextStage();
        } else {
            this.processPlayerTurn();
        }
    }

    isBettingRoundComplete() {
        const activePlayers = this.getActivePlayers();
        
        if (activePlayers.length <= 1) {
            return true;
        }
        
        const nonAllInPlayers = activePlayers.filter(p => !p.allIn);
        
        if (nonAllInPlayers.length === 0) {
            return true;
        }
        
        const allBetEqual = nonAllInPlayers.every(player => 
            player.currentBet === this.gameState.currentBet
        );
        
        if (!allBetEqual) {
            return false;
        }
        
        const allActed = nonAllInPlayers.every(player => player.hasActedThisRound);
        
        if (!allActed) {
            return false;
        }
        
        if (this.gameState.bettingRoundData.playersToAct.size === 0) {
            return true;
        }
        
        return false;
    }
    
    getNextActivePlayerIndex(fromIndex) {
        const totalPlayers = this.gameState.players.length;
        let nextIndex = (fromIndex + 1) % totalPlayers;
        let loopCount = 0;
        
        while (loopCount < totalPlayers) {
            const player = this.gameState.players[nextIndex];
            if (!player.folded && !player.allIn) {
                return nextIndex;
            }
            nextIndex = (nextIndex + 1) % totalPlayers;
            loopCount++;
        }
        
        return -1;
    }
    
    getFirstActivePlayerIndex() {
        for (let i = 0; i < this.gameState.players.length; i++) {
            const player = this.gameState.players[i];
            if (!player.folded && !player.allIn) {
                return i;
            }
        }
        return 0;
    }
    
    getActivePlayers() {
        return this.gameState.players.filter(p => !p.folded);
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
                return;
        }
        
        this.gameState.currentBet = 0;
        this.gameState.players.forEach(player => {
            player.currentBet = 0;
            player.hasActedThisRound = false;
        });
        this.gameState.bettingRoundData.lastRaiserIndex = -1;
        this.gameState.bettingRoundData.minRaise = this.gameState.blindAmount;
        
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
            this.declareWinner(activePlayers[0], '所有对手弃牌');
            return;
        }
        
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
        
        this.gameState.players.forEach((p, index) => {
            this.updatePlayerCardsDisplay(index, p.cards);
        });
        
        const winnerText = player.isHuman ? '恭喜您获胜！' : player.displayName + ' 获胜！';
        const resultMessage = winnerText + ' 赢得 ' + this.gameState.pot + ' 筹码，牌型：' + handType;
        
        this.addLog(resultMessage);
        
        this.showNewGameButton(resultMessage);
        
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
        
        this.addLog(resultMessage);
        
        this.showNewGameButton(resultMessage);
        
        this.savePlayerChips();
    }

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
                } else if (player.allIn) {
                    statusElement.textContent = 'ALL-IN';
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
                
                setTimeout(() => {
                    cardElement.classList.remove('dealing');
                }, 500);
            }
        });
    }

    updateCommunityCardsDisplay() {
        if (!this.communityCardsElement) return;
        
        this.communityCardsElement.innerHTML = '';
        
        this.gameState.communityCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card front ${card.color} dealing`;
            cardElement.setAttribute('data-rank', card.rank);
            cardElement.setAttribute('data-suit', card.suit);
            cardElement.textContent = card.rank + card.suit;
            this.communityCardsElement.appendChild(cardElement);
            
            setTimeout(() => {
                cardElement.classList.remove('dealing');
            }, 500);
        });
        
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
        if (!currentPlayer || currentPlayer.folded || currentPlayer.allIn) {
            isHumanTurn = false;
        }
        
        const callAmount = this.gameState.currentBet - currentPlayer.currentBet;
        const isPreFlop = this.gameState.currentStage === 'PREFLOP';
        const blindsOnly = isPreFlop && this.gameState.currentBet === this.gameState.blindAmount;
        
        this.hideBetInputSection();
        
        if (callAmount === 0 && !blindsOnly) {
            if (this.checkBtn) this.checkBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            if (this.callBtn) this.callBtn.style.display = 'none';
            if (this.betBtn) this.betBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            if (this.raiseBtn) this.raiseBtn.style.display = 'none';
        } else if (callAmount === 0 && blindsOnly) {
            if (this.checkBtn) this.checkBtn.style.display = 'none';
            if (this.callBtn) {
                this.callBtn.textContent = '跟注';
                this.callBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            }
            if (this.betBtn) this.betBtn.style.display = 'none';
            if (this.raiseBtn) this.raiseBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
        } else {
            if (this.checkBtn) this.checkBtn.style.display = 'none';
            if (this.callBtn) {
                this.callBtn.textContent = '跟注 ' + callAmount;
                this.callBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
            }
            if (this.betBtn) this.betBtn.style.display = 'none';
            if (this.raiseBtn) this.raiseBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
        }
        
        if (this.allInBtn) {
            const allInText = currentPlayer.chips > this.gameState.currentBet ? 
                'All-in (' + currentPlayer.chips + ')' : 'All-in';
            this.allInBtn.textContent = allInText;
            this.allInBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
        }
        
        if (this.foldBtn) this.foldBtn.style.display = isHumanTurn ? 'inline-block' : 'none';
        
        if (!isHumanTurn) {
            if (this.checkBtn) this.checkBtn.disabled = true;
            if (this.callBtn) this.callBtn.disabled = true;
            if (this.allInBtn) this.allInBtn.disabled = true;
            if (this.foldBtn) this.foldBtn.disabled = true;
            if (this.betBtn) this.betBtn.disabled = true;
            if (this.raiseBtn) this.raiseBtn.disabled = true;
        } else {
            if (this.checkBtn) this.checkBtn.disabled = false;
            if (this.callBtn) this.callBtn.disabled = false;
            if (this.allInBtn) this.allInBtn.disabled = false;
            if (this.foldBtn) this.foldBtn.disabled = false;
            if (this.betBtn) this.betBtn.disabled = false;
            if (this.raiseBtn) this.raiseBtn.disabled = false;
        }
    }
    
    showBetInputSection(isRaise) {
        if (!this.betInputSection) return;
        
        this.betInputSection.style.display = 'flex';
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const minAmount = isRaise ? 
            (this.gameState.currentBet + this.gameState.bettingRoundData.minRaise) : 
            (this.gameState.currentBet > 0 ? this.gameState.currentBet + this.gameState.bettingRoundData.minRaise : 10);
        
        if (this.betAmountInput) {
            this.betAmountInput.min = minAmount;
            this.betAmountInput.value = minAmount;
            this.betAmountInput.max = currentPlayer.chips + currentPlayer.currentBet;
            this.betAmountInput.focus();
        }
    }
    
    hideBetInputSection() {
        if (this.betInputSection) {
            this.betInputSection.style.display = 'none';
        }
        if (this.betAmountInput) {
            this.betAmountInput.value = '';
        }
    }

    executeBet() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (this.betInputSection?.style.display === 'none' || !this.betInputSection) {
            this.showBetInputSection(false);
            return;
        }
        
        const minBet = this.gameState.currentBet > 0 ? 
            this.gameState.currentBet + this.gameState.bettingRoundData.minRaise : 10;
        
        const inputAmount = parseInt(this.betAmountInput?.value) || 0;
        const totalBet = inputAmount;
        
        if (totalBet === 0) {
            this.addLog('请输入下注金额');
            return;
        }
        
        if (totalBet < minBet && this.gameState.currentBet > 0) {
            this.addLog('下注金额 ' + totalBet + ' 小于最小下注额 ' + minBet);
            return;
        }
        
        if (totalBet > currentPlayer.chips + currentPlayer.currentBet) {
            this.addLog('下注金额 ' + totalBet + ' 超过您的筹码 ' + (currentPlayer.chips + currentPlayer.currentBet));
            return;
        }
        
        const actualBet = Math.min(totalBet, currentPlayer.chips + currentPlayer.currentBet);
        this.executeAction('BET', actualBet - currentPlayer.currentBet);
    }
    
    executeRaise() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (this.betInputSection?.style.display === 'none' || !this.betInputSection) {
            this.showBetInputSection(true);
            return;
        }
        
        const currentBet = this.gameState.currentBet;
        const playerBet = currentPlayer.currentBet;
        const minRaise = currentBet + this.gameState.bettingRoundData.minRaise;
        
        const inputAmount = parseInt(this.betAmountInput?.value) || 0;
        const totalBet = inputAmount;
        
        if (totalBet === 0) {
            this.addLog('请输入加注金额');
            return;
        }
        
        if (totalBet < minRaise) {
            this.addLog('加注金额 ' + totalBet + ' 小于最小加注额 ' + minRaise);
            return;
        }
        
        if (totalBet > currentPlayer.chips + playerBet) {
            this.addLog('加注金额 ' + totalBet + ' 超过您的筹码 ' + (currentPlayer.chips + playerBet));
            return;
        }
        
        const actualRaise = Math.min(totalBet, currentPlayer.chips + playerBet);
        this.executeAction('RAISE', actualRaise - playerBet);
    }

    hideBetControls() {
        this.hideBetInputSection();
    }

    addLog(message) {
        if (!this.logMessagesElement) return;
        
        const logEntry = document.createElement('div');
        logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
        this.logMessagesElement.appendChild(logEntry);
        
        this.logMessagesElement.scrollTop = this.logMessagesElement.scrollHeight;
        
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
        if (!this.newGameButton) {
            this.newGameButton = document.createElement('button');
            this.newGameButton.id = 'newGameBtn';
            this.newGameButton.className = 'new-game-btn';
            this.newGameButton.textContent = '新的一局';
            this.newGameButton.addEventListener('click', () => this.startNewGame());
            
            const gameControls = document.querySelector('.game-controls');
            if (gameControls) {
                gameControls.appendChild(this.newGameButton);
            }
        }
        
        this.newGameButton.style.display = 'block';
        
        this.disableActionButtons();
        
        this.hideGameOverDisplay();
        
        this.addLog('游戏结束：' + message);
    }

    hideNewGameButton() {
        if (this.newGameButton) {
            this.newGameButton.style.display = 'none';
        }
        
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

    isHumanTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        return currentPlayer && currentPlayer.isHuman && !currentPlayer.folded && !currentPlayer.allIn;
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
}

document.addEventListener('DOMContentLoaded', () => {
    new TexasHoldemGame();
});

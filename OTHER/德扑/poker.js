// 扑克牌逻辑核心
class PokerLogic {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.handRanks = [
            '高牌', '一对', '两对', '三条', '顺子', 
            '同花', '葫芦', '四条', '同花顺', '皇家同花顺'
        ];
    }

    // 创建一副新牌
    createDeck() {
        const deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push({
                    suit: suit,
                    rank: rank,
                    value: this.getCardValue(rank),
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            }
        }
        return this.shuffleDeck(deck);
    }

    // 洗牌
    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 获取牌面值
    getCardValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
            '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank];
    }

    // 评估手牌强度（从7张牌中找出最佳5张牌组合）
    evaluateHand(cards) {
        if (cards.length < 5) return null;
        
        const combinations = this.getCombinations(cards, 5);
        let bestHand = null;
        
        for (let combination of combinations) {
            const handScore = this.scoreHand(combination);
            if (!bestHand || this.compareHands(handScore, bestHand) > 0) {
                bestHand = handScore;
            }
        }
        
        return bestHand;
    }

    // 获取所有可能的组合
    getCombinations(arr, k) {
        const result = [];
        
        function combine(start, current) {
            if (current.length === k) {
                result.push([...current]);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                combine(i + 1, current);
                current.pop();
            }
        }
        
        combine(0, []);
        return result;
    }

    // 评分手牌
    scoreHand(cards) {
        // 按牌面值排序
        const sortedCards = [...cards].sort((a, b) => b.value - a.value);
        const values = sortedCards.map(card => card.value);
        const suits = sortedCards.map(card => card.suit);
        
        // 检查各种牌型
        const isFlush = this.isFlush(suits);
        const isStraight = this.isStraight(values);
        const rankCounts = this.getRankCounts(values);
        
        // 皇家同花顺
        if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
            return {
                rank: 9,
                name: '皇家同花顺',
                cards: sortedCards,
                highCard: 14
            };
        }
        
        // 同花顺
        if (isFlush && isStraight) {
            return {
                rank: 8,
                name: '同花顺',
                cards: sortedCards,
                highCard: values[0]
            };
        }
        
        // 四条
        if (rankCounts[4]) {
            return {
                rank: 7,
                name: '四条',
                cards: sortedCards,
                highCard: rankCounts[4][0]
            };
        }
        
        // 葫芦
        if (rankCounts[3] && rankCounts[2]) {
            return {
                rank: 6,
                name: '葫芦',
                cards: sortedCards,
                highCard: rankCounts[3][0]
            };
        }
        
        // 同花
        if (isFlush) {
            return {
                rank: 5,
                name: '同花',
                cards: sortedCards,
                highCard: values[0]
            };
        }
        
        // 顺子
        if (isStraight) {
            return {
                rank: 4,
                name: '顺子',
                cards: sortedCards,
                highCard: values[0]
            };
        }
        
        // 三条
        if (rankCounts[3]) {
            return {
                rank: 3,
                name: '三条',
                cards: sortedCards,
                highCard: rankCounts[3][0]
            };
        }
        
        // 两对
        if (rankCounts[2] && rankCounts[2].length >= 2) {
            return {
                rank: 2,
                name: '两对',
                cards: sortedCards,
                highCard: Math.max(...rankCounts[2])
            };
        }
        
        // 一对
        if (rankCounts[2]) {
            return {
                rank: 1,
                name: '一对',
                cards: sortedCards,
                highCard: rankCounts[2][0]
            };
        }
        
        // 高牌
        return {
            rank: 0,
            name: '高牌',
            cards: sortedCards,
            highCard: values[0]
        };
    }

    // 检查是否同花
    isFlush(suits) {
        return suits.every(suit => suit === suits[0]);
    }

    // 检查是否顺子
    isStraight(values) {
        // 处理A-2-3-4-5的特殊情况
        if (JSON.stringify(values) === JSON.stringify([14, 5, 4, 3, 2])) {
            return true;
        }
        
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) {
                return false;
            }
        }
        return true;
    }

    // 获取牌面值计数
    getRankCounts(values) {
        const counts = {};
        for (let value of values) {
            counts[value] = (counts[value] || 0) + 1;
        }
        
        const result = {};
        for (let [value, count] of Object.entries(counts)) {
            if (!result[count]) result[count] = [];
            result[count].push(parseInt(value));
        }
        
        return result;
    }

    // 比较两手牌
    compareHands(hand1, hand2) {
        if (hand1.rank !== hand2.rank) {
            return hand1.rank - hand2.rank;
        }
        
        // 相同牌型，比较高牌
        if (hand1.highCard !== hand2.highCard) {
            return hand1.highCard - hand2.highCard;
        }
        
        // 如果高牌也相同，比较次高牌（这里简化处理）
        const values1 = hand1.cards.map(card => card.value).sort((a, b) => b - a);
        const values2 = hand2.cards.map(card => card.value).sort((a, b) => b - a);
        
        for (let i = 0; i < values1.length; i++) {
            if (values1[i] !== values2[i]) {
                return values1[i] - values2[i];
            }
        }
        
        return 0; // 完全平手
    }

    // 计算手牌胜率（简化版）
    calculateWinProbability(playerCards, communityCards, opponentsCount) {
        // 这里实现一个简化的胜率计算
        const allCards = [...playerCards, ...communityCards];
        const handScore = this.evaluateHand(allCards);
        
        if (!handScore) return 0.5; // 默认50%胜率
        
        // 根据牌型给出基础胜率
        const baseProbabilities = [0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0];
        let probability = baseProbabilities[handScore.rank] || 0.5;
        
        // 根据对手数量调整
        probability = Math.pow(probability, 1 / opponentsCount);
        
        return Math.max(0.05, Math.min(0.95, probability));
    }

    // 获取手牌描述
    getHandDescription(cards) {
        if (cards.length < 2) return '等待发牌...';
        
        const handScore = this.evaluateHand(cards);
        if (!handScore) return '高牌';
        
        return handScore.name;
    }

    // 格式化牌面显示
    formatCard(card) {
        return `${card.rank}${card.suit}`;
    }

    // 获取牌型排名
    getHandRankName(rank) {
        return this.handRanks[rank] || '未知牌型';
    }
}

// AI决策辅助类（基于几何与概率混合评估方法）
class AIHelper {
    constructor(pokerLogic) {
        this.pokerLogic = pokerLogic;
    }

    // 基础牌力评分（基于cos(x)函数）
    calculateBaseHandStrength(handRank) {
        // 将牌型映射到x区间 (0, 1)
        const xRanges = [
            [0.20, 0.50], // 高牌
            [0.50, 0.60], // 对子
            [0.60, 0.65], // 两对
            [0.65, 0.70], // 三条
            [0.70, 0.75], // 顺子
            [0.75, 0.80], // 同花
            [0.80, 0.85], // 葫芦
            [0.85, 0.90], // 四条
            [0.90, 0.95], // 同花顺
            [0.95, 1.00]  // 皇家同花顺
        ];
        
        if (handRank < 0 || handRank >= xRanges.length) {
            return 0.5; // 默认值
        }
        
        const [minX, maxX] = xRanges[handRank];
        const x = (minX + maxX) / 2; // 取区间中点
        return Math.cos(x); // P_base = cos(x)
    }

    // 计算潜在牌力
    calculatePotentialStrength(playerCards, communityCards, handRank) {
        const remainingCards = 5 - communityCards.length;
        if (remainingCards === 0) return this.calculateBaseHandStrength(handRank);
        
        const allCards = [...playerCards, ...communityCards];
        const baseStrength = this.calculateBaseHandStrength(handRank);
        
        // 检测听牌类型
        const drawTypes = this.detectDrawTypes(allCards);
        let maxPotential = baseStrength;
        
        // 计算每种听牌的潜在牌力
        for (const drawType of drawTypes) {
            const z = this.calculateDrawProbability(drawType, allCards);
            const potential = baseStrength * Math.pow(1 - z, remainingCards);
            maxPotential = Math.max(maxPotential, potential);
        }
        
        return maxPotential;
    }

    // 检测听牌类型
    detectDrawTypes(cards) {
        const drawTypes = [];
        
        // 同花听牌检测
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        
        for (const suit in suitCounts) {
            if (suitCounts[suit] >= 4) {
                drawTypes.push('FLUSH_DRAW');
                break;
            }
        }
        
        // 顺子听牌检测（简化版）
        const values = cards.map(card => card.value).sort((a, b) => a - b);
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i + 1] - values[i] === 1 && i < values.length - 2 && values[i + 2] - values[i + 1] === 1) {
                drawTypes.push('STRAIGHT_DRAW');
                break;
            }
        }
        
        return drawTypes;
    }

    // 计算听牌达成概率
    calculateDrawProbability(drawType, cards) {
        const totalCards = 52;
        const knownCards = cards.length;
        const remainingCards = totalCards - knownCards;
        
        switch (drawType) {
            case 'FLUSH_DRAW':
                // 计算同花听牌概率
                const suitCounts = {};
                cards.forEach(card => {
                    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
                });
                
                let maxSuitCount = 0;
                for (const suit in suitCounts) {
                    maxSuitCount = Math.max(maxSuitCount, suitCounts[suit]);
                }
                
                if (maxSuitCount >= 4) {
                    const neededCards = 5 - maxSuitCount;
                    const availableCards = 13 - maxSuitCount; // 剩余同花色牌
                    return neededCards / remainingCards;
                }
                break;
                
            case 'STRAIGHT_DRAW':
                // 简化版顺子听牌概率
                return 0.2; // 近似值
        }
        
        return 0.1; // 默认概率
    }

    // 评估当前局势（新版本）
    evaluateSituation(playerCards, communityCards, potSize, currentBet, playerChips, opponentActions, personality) {
        const allCards = [...playerCards, ...communityCards];
        const handStrength = this.pokerLogic.evaluateHand(allCards);
        
        if (!handStrength) {
            return {
                finalProbability: 0.3,
                baseStrength: 0.3,
                potentialStrength: 0.3,
                shouldFold: false,
                potOdds: currentBet > 0 ? currentBet / (potSize + currentBet) : 0
            };
        }
        
        // 基础牌力
        const baseStrength = this.calculateBaseHandStrength(handStrength.rank);
        
        // 潜在牌力
        const potentialStrength = this.calculatePotentialStrength(playerCards, communityCards, handStrength.rank);
        
        // 最终概率计算
        let finalProbability;
        if (personality === 'aggressive') {
            // 激进AI：取最大值
            finalProbability = Math.max(baseStrength, potentialStrength);
        } else {
            // 保守AI：取平均值
            finalProbability = (baseStrength + potentialStrength) / 2;
        }
        
        // 弃牌判断
        const callAmount = currentBet;
        const shouldFold = callAmount > playerChips * 0.5 && 
                          (1 - finalProbability * 0.6 - baseStrength * 0.4) > 0.7;
        
        return {
            finalProbability: finalProbability,
            baseStrength: baseStrength,
            potentialStrength: potentialStrength,
            shouldFold: shouldFold,
            potOdds: currentBet > 0 ? currentBet / (potSize + currentBet) : 0
        };
    }

    // 增强听牌检测功能
    detectDrawTypes(cards) {
        const drawTypes = [];
        
        // 同花听牌检测
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        
        for (const suit in suitCounts) {
            if (suitCounts[suit] >= 4) {
                drawTypes.push('FLUSH_DRAW');
                break;
            }
        }
        
        // 顺子听牌检测（增强版）
        const values = cards.map(card => card.value).sort((a, b) => a - b);
        
        // 检测开放式顺子听牌
        for (let i = 0; i < values.length - 2; i++) {
            if (values[i + 1] - values[i] === 1 && values[i + 2] - values[i + 1] === 1) {
                drawTypes.push('STRAIGHT_DRAW');
                break;
            }
        }
        
        // 检测葫芦潜力（三条+对子潜力）
        const valueCounts = {};
        values.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        });
        
        let hasThreeOfAKind = false;
        let hasPair = false;
        for (const value in valueCounts) {
            if (valueCounts[value] >= 3) hasThreeOfAKind = true;
            if (valueCounts[value] >= 2) hasPair = true;
        }
        
        if (hasThreeOfAKind || hasPair) {
            drawTypes.push('FULL_HOUSE_POTENTIAL');
        }
        
        return drawTypes;
    }

    // 增强听牌概率计算
    calculateDrawProbability(drawType, cards) {
        const totalCards = 52;
        const knownCards = cards.length;
        const remainingCards = totalCards - knownCards;
        
        switch (drawType) {
            case 'FLUSH_DRAW':
                // 计算同花听牌概率
                const suitCounts = {};
                cards.forEach(card => {
                    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
                });
                
                let maxSuitCount = 0;
                for (const suit in suitCounts) {
                    maxSuitCount = Math.max(maxSuitCount, suitCounts[suit]);
                }
                
                if (maxSuitCount >= 4) {
                    const neededCards = 5 - maxSuitCount;
                    const availableCards = 13 - maxSuitCount; // 剩余同花色牌
                    return Math.min(0.9, availableCards / remainingCards);
                }
                break;
                
            case 'STRAIGHT_DRAW':
                // 开放式顺子听牌概率
                return 0.32; // 近似值，实际约为32%
                
            case 'FULL_HOUSE_POTENTIAL':
                // 葫芦潜力概率
                return 0.15; // 简化概率
        }
        
        return 0.1; // 默认概率
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PokerLogic, AIHelper };
}
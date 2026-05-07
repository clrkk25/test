// 扑克牌逻辑核心（修复版）
class PokerLogic {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.handRanks = [
            '高牌', '一对', '两对', '三条', '顺子', 
            '同花', '葫芦', '四条', '同花顺', '皇家同花顺'
        ];
    }

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

    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getCardValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
            '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank];
    }

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

    scoreHand(cards) {
        const sortedCards = [...cards].sort((a, b) => b.value - a.value);
        const values = sortedCards.map(card => card.value);
        const suits = sortedCards.map(card => card.suit);
        
        const isFlush = this.isFlush(suits);
        const isStraight = this.isStraight(values);
        const rankCounts = this.getRankCounts(values);
        const kickers = this.getKickercards(values, rankCounts);
        
        if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
            return {
                rank: 9,
                name: '皇家同花顺',
                cards: sortedCards,
                kickers: [14]
            };
        }
        
        if (isFlush && isStraight) {
            const highCard = values[0] === 14 && values[1] === 5 ? 5 : values[0];
            return {
                rank: 8,
                name: '同花顺',
                cards: sortedCards,
                kickers: [highCard]
            };
        }
        
        if (rankCounts[4]) {
            return {
                rank: 7,
                name: '四条',
                cards: sortedCards,
                kickers: [rankCounts[4][0], ...kickers.filter(v => v !== rankCounts[4][0])]
            };
        }
        
        if (rankCounts[3] && rankCounts[2]) {
            return {
                rank: 6,
                name: '葫芦',
                cards: sortedCards,
                kickers: [rankCounts[3][0], rankCounts[2][0]]
            };
        }
        
        if (isFlush) {
            return {
                rank: 5,
                name: '同花',
                cards: sortedCards,
                kickers: values.slice(0, 5)
            };
        }
        
        if (isStraight) {
            const highCard = values[0] === 14 && values[1] === 5 ? 5 : values[0];
            return {
                rank: 4,
                name: '顺子',
                cards: sortedCards,
                kickers: [highCard]
            };
        }
        
        if (rankCounts[3]) {
            return {
                rank: 3,
                name: '三条',
                cards: sortedCards,
                kickers: [rankCounts[3][0], ...kickers.filter(v => v !== rankCounts[3][0]).slice(0, 2)]
            };
        }
        
        if (rankCounts[2] && rankCounts[2].length >= 2) {
            const pairs = rankCounts[2].sort((a, b) => b - a);
            return {
                rank: 2,
                name: '两对',
                cards: sortedCards,
                kickers: [...pairs, ...kickers.filter(v => !pairs.includes(v)).slice(0, 1)]
            };
        }
        
        if (rankCounts[2]) {
            return {
                rank: 1,
                name: '一对',
                cards: sortedCards,
                kickers: [rankCounts[2][0], ...kickers.filter(v => v !== rankCounts[2][0]).slice(0, 3)]
            };
        }
        
        return {
            rank: 0,
            name: '高牌',
            cards: sortedCards,
            kickers: values.slice(0, 5)
        };
    }

    isFlush(suits) {
        return suits.every(suit => suit === suits[0]);
    }

    isStraight(values) {
        const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
        
        if (uniqueValues.length < 5) return false;
        
        if (uniqueValues[0] - uniqueValues[4] === 4 && 
            uniqueValues.every((v, i) => i === 0 || uniqueValues[i-1] - v === 1)) {
            return true;
        }
        
        if (uniqueValues.includes(14) && uniqueValues.includes(2) && 
            uniqueValues.includes(3) && uniqueValues.includes(4) && 
            uniqueValues.includes(5)) {
            return true;
        }
        
        return false;
    }

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

    getKickercards(values, rankCounts) {
        return values.sort((a, b) => b - a);
    }

    compareHands(hand1, hand2) {
        if (hand1.rank !== hand2.rank) {
            return hand1.rank - hand2.rank;
        }
        
        const kickers1 = hand1.kickers || [];
        const kickers2 = hand2.kickers || [];
        
        for (let i = 0; i < Math.max(kickers1.length, kickers2.length); i++) {
            const v1 = kickers1[i] || 0;
            const v2 = kickers2[i] || 0;
            if (v1 !== v2) {
                return v1 - v2;
            }
        }
        
        return 0;
    }

    calculateWinProbability(playerCards, communityCards, opponentsCount) {
        const allCards = [...playerCards, ...communityCards];
        const handScore = this.evaluateHand(allCards);
        
        if (!handScore) return 0.5;
        
        const baseProbabilities = [0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0];
        let probability = baseProbabilities[handScore.rank] || 0.5;
        
        probability = Math.pow(probability, 1 / opponentsCount);
        
        return Math.max(0.05, Math.min(0.95, probability));
    }

    getHandDescription(cards) {
        if (cards.length < 2) return '等待发牌...';
        
        const handScore = this.evaluateHand(cards);
        if (!handScore) return '高牌';
        
        return handScore.name;
    }

    formatCard(card) {
        return `${card.rank}${card.suit}`;
    }

    getHandRankName(rank) {
        return this.handRanks[rank] || '未知牌型';
    }
}

// AI决策辅助类（修复版）
class AIHelper {
    constructor(pokerLogic) {
        this.pokerLogic = pokerLogic;
    }

    calculateBaseHandStrength(handRank) {
        const xRanges = [
            [0.20, 0.50],
            [0.50, 0.60],
            [0.60, 0.65],
            [0.65, 0.70],
            [0.70, 0.75],
            [0.75, 0.80],
            [0.80, 0.85],
            [0.85, 0.90],
            [0.90, 0.95],
            [0.95, 1.00]
        ];
        
        if (handRank < 0 || handRank >= xRanges.length) {
            return 0.5;
        }
        
        const [minX, maxX] = xRanges[handRank];
        const x = (minX + maxX) / 2;
        return Math.cos(x);
    }

    calculatePotentialStrength(playerCards, communityCards, handRank) {
        const remainingCards = 5 - communityCards.length;
        if (remainingCards === 0) return this.calculateBaseHandStrength(handRank);
        
        const allCards = [...playerCards, ...communityCards];
        const baseStrength = this.calculateBaseHandStrength(handRank);
        
        const drawTypes = this.detectDrawTypes(allCards);
        let maxPotential = baseStrength;
        
        for (const drawType of drawTypes) {
            const z = this.calculateDrawProbability(drawType, allCards);
            const potential = baseStrength + (1 - baseStrength) * z * (remainingCards / 5);
            maxPotential = Math.max(maxPotential, potential);
        }
        
        return maxPotential;
    }

    detectDrawTypes(cards) {
        const drawTypes = [];
        
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        
        for (const suit in suitCounts) {
            if (suitCounts[suit] === 4) {
                drawTypes.push('FLUSH_DRAW');
                break;
            }
        }
        
        const values = cards.map(card => card.value).sort((a, b) => a - b);
        const uniqueValues = [...new Set(values)];
        
        for (let i = 0; i <= uniqueValues.length - 4; i++) {
            const gap = uniqueValues[i + 3] - uniqueValues[i];
            if (gap <= 4 && gap >= 3) {
                drawTypes.push('STRAIGHT_DRAW');
                break;
            }
        }
        
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

    calculateDrawProbability(drawType, cards) {
        const totalCards = 52;
        const knownCards = cards.length;
        const remainingCards = totalCards - knownCards;
        
        switch (drawType) {
            case 'FLUSH_DRAW':
                const suitCounts = {};
                cards.forEach(card => {
                    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
                });
                
                let maxSuitCount = 0;
                for (const suit in suitCounts) {
                    maxSuitCount = Math.max(maxSuitCount, suitCounts[suit]);
                }
                
                if (maxSuitCount === 4) {
                    const availableCards = 13 - maxSuitCount;
                    return availableCards / remainingCards;
                }
                break;
                
            case 'STRAIGHT_DRAW':
                return 0.32;
                
            case 'FULL_HOUSE_POTENTIAL':
                return 0.15;
        }
        
        return 0.1;
    }

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
        
        const baseStrength = this.calculateBaseHandStrength(handStrength.rank);
        const potentialStrength = this.calculatePotentialStrength(playerCards, communityCards, handStrength.rank);
        
        let finalProbability;
        if (personality === 'aggressive') {
            finalProbability = Math.max(baseStrength, potentialStrength);
        } else {
            finalProbability = (baseStrength + potentialStrength) / 2;
        }
        
        const callAmount = currentBet;
        const potOdds = callAmount > 0 ? callAmount / (potSize + callAmount) : 0;
        const shouldFold = callAmount > playerChips * 0.6 && finalProbability < 0.3;
        
        return {
            finalProbability: finalProbability,
            baseStrength: baseStrength,
            potentialStrength: potentialStrength,
            shouldFold: shouldFold,
            potOdds: potOdds
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PokerLogic, AIHelper };
}

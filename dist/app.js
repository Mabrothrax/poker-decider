"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./hierarchy-store/store");
const firstHand = process.argv && process.argv[2];
const secondHand = process.argv && process.argv[3];
if (!firstHand || !secondHand) {
    console.log("Error: No params given");
}
const firstHandScore = getHandData(firstHand);
const secondHandScore = getHandData(secondHand);
if (firstHandScore && secondHandScore) {
    if (Array.isArray(firstHandScore)) {
        const fHandFirstScore = firstHandScore[0];
        if (fHandFirstScore < secondHandScore) {
            console.log("First hand wins!");
        }
        else if (fHandFirstScore > secondHandScore) {
            console.log("Second hand wins!");
        }
        else if (fHandFirstScore === secondHandScore) {
            console.log("It's a tie!");
        }
    }
    else if (Array.isArray(secondHandScore)) {
        const sHandFirstScore = secondHandScore[0];
        if (sHandFirstScore > firstHandScore) {
            console.log("First hand wins!");
        }
        else if (sHandFirstScore < firstHandScore) {
            console.log("Second hand wins!");
        }
        else if (sHandFirstScore === firstHandScore) {
            console.log("It's a tie!");
        }
    }
    if (Array.isArray(firstHandScore) && Array.isArray(secondHandScore)) {
        const fHandFirstScore = firstHandScore[0];
        const sHandFirstScore = secondHandScore[0];
        if (fHandFirstScore < sHandFirstScore) {
            console.log("First hand wins!");
        }
        else if (fHandFirstScore > sHandFirstScore) {
            console.log("Second hand wins!");
        }
        else if (fHandFirstScore === sHandFirstScore) {
            const fHandSecondtScore = firstHandScore[1];
            const sHandSecondScore = secondHandScore[1];
            if (fHandSecondtScore < sHandSecondScore) {
                console.log("First hand wins!");
            }
            else if (fHandSecondtScore > sHandSecondScore) {
                console.log("Second hand wins!");
            }
            else {
                console.log("It's a tie!");
            }
        }
    }
    else {
        if (firstHandScore < secondHandScore) {
            console.log("First hand wins!");
        }
        else if (firstHandScore > secondHandScore) {
            console.log("Second hand wins!");
        }
        else if (firstHandScore === secondHandScore) {
            console.log("It's a tie!");
        }
    }
}
else {
    console.log("Sum Ting Wong");
}
function getHandData(hand) {
    const cards = hand.split("");
    const rankedCards = [];
    for (const card of cards) {
        const foundCard = store_1.HierarchyStore.find(c => c.value === card);
        if (foundCard) {
            rankedCards.push(foundCard.value);
        }
    }
    const cardCount = {};
    for (const element of rankedCards) {
        cardCount[element] = (cardCount[element] || 0) + 1;
    }
    let ranking = [];
    let rankCollection = [];
    for (const [key, value] of Object.entries(cardCount)) {
        const foundDuplicateRanking = store_1.DuplicatesRankingStore.find(rank => rank.value === value);
        if (foundDuplicateRanking) {
            ranking.push(foundDuplicateRanking);
        }
        else {
            const foundHierarchyRanking = store_1.HierarchyStore.find(rank => rank.value == key);
            rankCollection.push(foundHierarchyRanking.rank);
        }
    }
    if (rankCollection.length) {
        ranking.push({ rank: Math.min(...rankCollection) });
    }
    if (ranking.length === 1) {
        return ranking[0].rank;
    }
    else if (ranking.length > 1) {
        const duplicatedEntries = ranking.flatMap(entry => entry.value ? entry.value : []);
        const foundRanking = store_1.DuplicatesRankingStore.find(rank => JSON.stringify(rank.value) === JSON.stringify(duplicatedEntries[0]));
        if (ranking.length === 2) {
            return [foundRanking === null || foundRanking === void 0 ? void 0 : foundRanking.rank, ranking[1].rank];
        }
        else if (ranking.length === 3) {
            return [foundRanking === null || foundRanking === void 0 ? void 0 : foundRanking.rank, ranking[2].rank];
        }
        return foundRanking === null || foundRanking === void 0 ? void 0 : foundRanking.rank;
    }
    else {
        return null;
    }
}

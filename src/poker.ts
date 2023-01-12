import { HierarchyStore, DuplicatesRankingStore } from './hierarchy-store/store';
import { HandScore } from './models/handScore';

try {
    const firstHand: string = process.argv && process.argv[2];
    const secondHand: string = process.argv && process.argv[3];

    if (firstHand && secondHand) {
        const bothHandsData = [...firstHand, ...secondHand];
        const inputValidation = validateHandsInput(bothHandsData);

        if (!inputValidation) {
            throw new Error("Error: Something wrong with your cards, check them!");
        }

        const firstHandScore: HandScore = getHandData(firstHand);
        const secondHandScore: HandScore = getHandData(secondHand);

        if (firstHandScore && secondHandScore) {
            if (Array.isArray(firstHandScore && firstHandScore.rankScore)) {
                const fHandFirstScore = firstHandScore.rankScore[0];
                if (fHandFirstScore < secondHandScore) {
                    returnResponse("First hand wins!");
                } else if (fHandFirstScore > secondHandScore) {
                    returnResponse("Second hand wins!");
                } else if (fHandFirstScore === secondHandScore) {
                    returnResponse("It's a tie!");
                }
            } else if (Array.isArray(secondHandScore && secondHandScore.rankScore)) {
                const sHandFirstScore = secondHandScore.rankScore[0];
                if (sHandFirstScore > firstHandScore) {
                    returnResponse("First hand wins!");
                } else if (sHandFirstScore < firstHandScore) {
                    returnResponse("Second hand wins!");
                } else if (sHandFirstScore === firstHandScore) {
                    returnResponse("It's a tie!");
                }
            }

            if (Array.isArray(firstHandScore && firstHandScore.rankScore) && Array.isArray(secondHandScore && secondHandScore.rankScore)) {
                const fHandFirstScore = firstHandScore.rankScore[0];
                const sHandFirstScore = secondHandScore.rankScore[0];

                if (fHandFirstScore < sHandFirstScore) {
                    returnResponse("First hand wins!");
                } else if (fHandFirstScore > sHandFirstScore) {
                    returnResponse("Second hand wins!");
                } else if (fHandFirstScore === sHandFirstScore) {
                    const fHandDuplicateScore = firstHandScore.duplicateRank;
                    const sHandDuplicateScore = secondHandScore.duplicateRank;
                    const fHandSecondtScore = firstHandScore.rankScore[1];
                    const sHandSecondScore = secondHandScore.rankScore[1];

                    if (fHandDuplicateScore! < sHandDuplicateScore!) {
                        returnResponse("First hand wins!");
                    } else if (fHandDuplicateScore! > sHandDuplicateScore!) {
                        returnResponse("Second hand wins!");
                    } else if (fHandDuplicateScore === sHandDuplicateScore) {
                        if (fHandSecondtScore < sHandSecondScore) {
                            returnResponse("First hand wins!");
                        } else if (fHandSecondtScore > sHandSecondScore) {
                            returnResponse("Second hand wins!");
                        } else {
                            returnResponse("It's a tie!");
                        }
                    }
                }
            } else {
                if (firstHandScore < secondHandScore) {
                    returnResponse("First hand wins!");
                } else if (firstHandScore > secondHandScore) {
                    returnResponse("Second hand wins!");
                } else if (firstHandScore === secondHandScore) {
                    returnResponse("It's a tie!");
                }
            }
        } else {
            console.log("Error: Something went wrong, check parameters");
        }
    } else {
        console.log("Error: No params given");
    }
} catch (error: any) {
    console.log(error && error.message)
}

function getHandData(hand: string) {
    const cards: string[] = hand.split("");
    const rankedCards: string[] = [];
    for (const card of cards) {
        const foundCard = HierarchyStore.find(c => c.value === card);
        if (foundCard) {
            rankedCards.push(foundCard.value)
        }
    }
    const cardCount = countDuplicates(rankedCards);
    let ranking: any[] = [];
    let rankCollection: any[] = [];
    for (const [key, value] of Object.entries(cardCount)) {
        const foundDuplicateRanking = DuplicatesRankingStore.find(rank => rank.value === value)
        if (foundDuplicateRanking) {
            const keyRank = HierarchyStore.find(rank => rank.value == key);
            ranking.push({ keyRank: keyRank!.rank, record: foundDuplicateRanking });
        } else {
            const foundHierarchyRanking = HierarchyStore.find(rank => rank.value == key);
            rankCollection.push(foundHierarchyRanking!.rank);
        }
    }
    if (rankCollection.length) {
        ranking.push({ rank: Math.min(...rankCollection) });
    }
    if (ranking.length === 1) {
        return ranking[0].rank;
    } else if (ranking.length > 1) {
        const duplicatedEntries = ranking.flatMap(entry => {
            const entryValue = entry && entry.record && entry.record.value ? entry.record.value : entry.value;
            return entryValue ? entryValue : [];
        }).sort((a, b) => a - b)
        const foundRanking = DuplicatesRankingStore.find(rank => JSON.stringify(rank.value) === JSON.stringify(duplicatedEntries.length > 1 ? duplicatedEntries : duplicatedEntries[0]));
        if (ranking.length === 2) {
            return new HandScore([foundRanking?.rank, ranking[1].rank || foundRanking!.value].sort((a, b) => a - b), ranking[0].keyRank);
        } else if (ranking.length === 3) {
            return new HandScore([foundRanking?.rank, ranking[2].rank].sort((a, b) => a - b), ranking[0].keyRank);
        }
        return foundRanking?.rank;
    } else {
        return null;
    }
}

function returnResponse(result: string) {
    console.log(result);
}

function validateHandsInput(handsData: string[]) {
    if (handsData.length > 10 || handsData.length < 10) {
        return false;
    }

    const allDuplicates = countDuplicates(handsData);
    let cardsValid: boolean = true;
    for (const [key, value] of Object.entries(allDuplicates)) {
        if (value! > 4) {
            cardsValid = false;
        }
    }
    return cardsValid;
}

function countDuplicates(data: string[]) {
    const cardCount: any = {};
    for (const element of data) {
        cardCount[element] = (cardCount[element] || 0) + 1;
    }
    return cardCount;
}
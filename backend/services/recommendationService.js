
const stopWords = new Set([
  "the", "a", "an", "of", "to", "and", "or", "in", "on", "for", "with",
  "this", "that", "it", "by", "from", "as", "be", "have", "has", "had"
]);

const tokenize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word));
};


const suggestDueDate = (card) => {
  if (card.dueDate) return null;

  const combinedText = `${card.title} ${card.description}`.toLowerCase();
  const suggestedDate = new Date();

  if (combinedText.includes("urgent") || combinedText.includes("asap")) {
    suggestedDate.setDate(suggestedDate.getDate() + 1);
  } else if (combinedText.includes("week")) {
    suggestedDate.setDate(suggestedDate.getDate() + 5);
  } else {
    suggestedDate.setDate(suggestedDate.getDate() + 3);
  }

  return suggestedDate;
};



const suggestListMovement = (card, board) => {
  const text = `${card.title} ${card.description}`.toLowerCase();


  const listTitles = board.lists.reduce((map, list) => {
    map[list._id] = list.title.toLowerCase();
    return map;
  }, {});

  const currentListTitle = listTitles[card.listId];


  if (currentListTitle.includes("to do") && text.includes("started")) {
    const target = board.lists.find((l) =>
      l.title.toLowerCase().includes("progress")
    );

    return target
      ? { from: currentListTitle, to: target.title, targetListId: target._id }
      : null;
  }


  if (currentListTitle.includes("progress") && text.includes("done")) {
    const target = board.lists.find((l) =>
      l.title.toLowerCase().includes("done")
    );

    return target
      ? { from: currentListTitle, to: target.title, targetListId: target._id }
      : null;
  }

  return null;
};



const findRelatedCards = (card, board) => {
  const keywords = new Set(tokenize(`${card.title} ${card.description}`));

  return board.cards
    .filter((c) => String(c._id) !== String(card._id))
    .map((other) => {
      const otherWords = tokenize(`${other.title} ${other.description}`);
      const matches = otherWords.filter((word) => keywords.has(word));

      return matches.length >= 2
        ? { id: other._id, title: other.title }
        : null;
    })
    .filter(Boolean);
};


export const buildRecommendations = (card, board) => {
  return {
    dueDateSuggestion: suggestDueDate(card),
    movementSuggestion: suggestListMovement(card, board),
    relatedCards: findRelatedCards(card, board)
  };
};

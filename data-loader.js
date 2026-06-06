// Simple JSON Data Loader
// Loads card data from static JSON files

async function loadTopicCardsFromJSON(topicSlug) {
  try {
    console.log('Loading cards from JSON:', topicSlug);
    const response = await fetch(`data/${topicSlug}.json`);
    
    if (!response.ok) {
      console.log('No JSON file found for', topicSlug);
      return [];
    }
    
    const cards = await response.json();
    console.log('Loaded', cards.length, 'cards for', topicSlug);
    
    return cards;
  } catch (error) {
    console.error('Error loading JSON:', error);
    return [];
  }
}

// Override the global loader
window.loadTopicCardsFromSheet = loadTopicCardsFromJSON;

import { useState } from 'react';
import { generateInsights } from '../../utils/openai';
import './Navbar.scss';

const Navbar = ({ onSearchResults, onSearchStart }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    onSearchStart();
    try {
      const searchData = {
        searchQuery: query,
        transactions: [
          {
            date: '2024-02-22',
            amount: 145.75,
            category: 'entertainment',
            description: 'Movie tickets and dinner'
          }
        ],
        budgets: {
          entertainment: {
            limit: 300,
            spent: 245.75,
            remaining: 54.25
          }
        },
        goals: {
          savingsTarget: {
            name: 'Emergency Fund',
            target: 10000,
            current: 5000
          }
        }
      };

      const response = await generateInsights('search', searchData);
      
      // Handle empty response
      if (!response) {
        throw new Error('Empty response from search');
      }

      // Parse response if it's a string
      let parsedResponse;
      try {
        parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        console.error('Failed to parse search response:', parseError);
        throw new Error('Invalid response format');
      }

      // Ensure the response has the required structure with default values
      const formattedResults = {
        matches: [],
        summary: '',
        suggestions: '',
        ...parsedResponse
      };

      // Ensure matches is an array and all items are properly formatted
      formattedResults.matches = (Array.isArray(formattedResults.matches) ? formattedResults.matches : [])
        .map(match => ({
          type: String(match?.type || 'Unknown'),
          item: String(match?.item || 'No details available'),
          relevance: String(match?.relevance || 'No relevance information')
        }))
        .filter(match => match.type && match.item); // Remove any invalid matches

      // Convert all string fields to strings
      formattedResults.summary = String(formattedResults.summary || 'No summary available');
      formattedResults.suggestions = String(formattedResults.suggestions || '');

      onSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults({
        matches: [],
        summary: 'Error performing search. Please try again.',
        suggestions: ''
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search your finances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            Search
          </button>
        </form>
      </div>
      
      <div className="nav-actions">
        <button className="profile-button">
          <span>JD</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
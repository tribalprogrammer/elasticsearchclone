import React, { useState } from 'react';
import './App.css';
import AppBody from './components/Body';
import Pagination from './components/Pagination';
import { searchAPI } from './utils';


const App = () => {
  // input text
  const [inputText, setInputText] = useState('');
  const onChangeText = (e) => setInputText(e.target.value);

  // pagination
  const [pagination, setPagination] = useState({ limit: 5, offset: 0, count: 0});

  // loading state
  const [loading, setLoading] = useState('');

  // search results
  const [results, setResults] = useState(null);

  // search API wrapper
  const search = (limit, offset) => {
    setLoading(true);
    searchAPI(
      inputText,
      {limit, offset},
      (response) => {
        setSearchResults(response, limit, offset);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  };

  const setSearchResults = (response, limit, offset) => {
    setPagination({
      offset,
      limit,
      count: response.count
    });
    setResults(response.results);
  };
 
  return (
    <div className="App">
      <form onSubmit={(e) => {
        e.preventDefault();
        search(pagination.limit, 0);
      }}
      >
        <header className={!results ? "App-header" : "App-header-searched"}>
          <input
            value={inputText}
            onChange={onChangeText}
            className="Input-box"
            autoFocus={true}
          />
          <AppBody results={results} search={() => search(pagination.limit, 0)} loading={loading}/>
          { pagination.count >= 5 && <Pagination {...pagination} search={search}/> }
        </header>
      </form>
    </div>
  );
}

export default App;

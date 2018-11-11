import React from 'react';
import '../App.css';
import SearchList from './SearchList';

const AppBody = ({results, search, loading}) => {
  if (!results) {
    return (
      <div className="Button-container" onClick={search} disabled={loading}>
        {loading ? "Please wait..." : "Search"}
      </div>
    );  
  }
  return <SearchList results={results}/>
}

export default AppBody;
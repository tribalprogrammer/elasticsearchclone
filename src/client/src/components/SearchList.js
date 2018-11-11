import React from 'react';
import '../App.css';
import SearchElement from './SearchElement';

const SearchList = ({results}) => {
  return (
    <div className="Search-list">
      {
        results.map(item => <SearchElement item={item}/>)
      }
    </div>
  )
};

export default SearchList;
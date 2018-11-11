import React from 'react';
import '../App.css';

const SearchElement = ({item}) => {
  const { title, content, uid } = item;
  const titleLength = title.length;
  const contentLenth = content.length;
  return (
    <a href={"/doc/" + uid} target="_blank" rel="noopener noreferrer" key={uid}>
      <div className="Search-element">
        <div className="Search-element-title">
          {titleLength <= 90 ? title : `${title.substring(0, 70)}...`}
        </div>
        <div className="Search-element-content">
          { contentLenth <=90 ? content : `${content.substring(0, 70)}...`}
        </div>
        <hr className="Separator"/>
      </div>
    </a>
  );
};

export default SearchElement;
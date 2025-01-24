import React, { useState } from 'react';
import './css/SearchBox.css';

const SearchBox = ({
    searchType,
    handleSearchTypeChange,
    handleSearch,
    handleSearchSubmit
}) => {
    const [localSearchKeyword, setLocalSearchKeyword] = useState('');

    const handleLocalSearchChange = (e) => {
        setLocalSearchKeyword(e.target.value);
    };

    const handleSubmit = () => {
        handleSearch(localSearchKeyword);
        handleSearchSubmit();
    };

    return (
        <div className="board-searchBox">
            <select
                value={searchType}
                onChange={handleSearchTypeChange}
            >
                <option value="title">제목</option>
                <option value="author">이름</option>
            </select>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={localSearchKeyword}
                onChange={handleLocalSearchChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            />
            <button onClick={handleSubmit}>입력</button>
        </div>
    );
};

export default React.memo(SearchBox);
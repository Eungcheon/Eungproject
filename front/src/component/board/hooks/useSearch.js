import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const useSearch = (initialSearchType = 'title', initialKeyword = '') => {
    const [searchType, setSearchType] = useState(initialSearchType);
    const [searchKeyword, setSearchKeyword] = useState(initialKeyword);

    const debouncedSearch = useCallback(
        debounce((callback) => {
            callback();
        }, 300),
        []
    );

    const handleSearchChange = useCallback((e) => {
        setSearchKeyword(e.target.value);
    }, []);

    const handleSearch = useCallback((callback) => {
        debouncedSearch(() => {
            callback(searchKeyword);
        });
    }, [debouncedSearch, searchKeyword]);

    const handleSearchTypeChange = useCallback((e) => {
        setSearchType(e.target.value);
    }, []);

    return {
        searchType,
        searchKeyword,
        setSearchKeyword,
        handleSearchChange,
        handleSearch,
        handleSearchTypeChange
    };
};

export default useSearch;

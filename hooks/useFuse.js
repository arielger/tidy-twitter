import Fuse from "fuse.js";
import { useState, useMemo, useCallback } from "react";
import { debounce } from "throttle-debounce";

const useFuse = (list, options) => {
  const [query, updateQuery] = useState("");

  // Internal query state for debouncing
  const [_query, _updateQuery] = useState("");

  const fuse = useMemo(() => new Fuse(list, options), [list, options]);

  const results = useMemo(() => {
    return !_query
      ? fuse.getIndex().docs
      : fuse.search(_query).map(({ item }) => item);
  }, [fuse, _query]);

  const debounceUpdateQuery = useCallback(debounce(1000, _updateQuery), []);

  const onSearch = useCallback(
    (e) => {
      updateQuery(e.target.value);
      debounceUpdateQuery(e.target.value);
    },
    [updateQuery, debounceUpdateQuery]
  );

  return {
    results,
    onSearch,
    query,
  };
};

export default useFuse;

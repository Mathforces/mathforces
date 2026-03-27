"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

interface InfiniteScrollOptions {
  limit: number;
}
const defaultOptions = {
  limit: 20,
};
type Props = {
  apiUrl: string;
  options?: InfiniteScrollOptions;
};

function useInfiniteScroll({ apiUrl, options = defaultOptions }: Props) {
  const [items, setItems] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(false);
  const [pointer, setPointer] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { limit } = options;

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams({ limit: limit.toString() });
      if (pointer) {
        params.append("pointer", pointer);
      }

      const url = `${apiUrl}?${params.toString()}`;

      console.log("url: ", url);
      const req = await axios.get(url);
      const res = req.data;
      if (res) {
        setItems((items: any) => {
          return items ? [...items, ...res.data] : res.data;
        });
        setHasMore(res.hasMore);
        setPointer(res.nextPointer);
      }
    } catch (error) {
      console.log("Couldn't get data");
      console.error(error);
    }
    setLoading(false);
  }, [hasMore, loading, items, pointer]);

  // observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading]);

  //  initial load
  useEffect(() => {
    if (!items || items.length === 0) {
      fetchMore();
    }
  }, []);

  return { items, loading, observerTarget };
}

export default useInfiniteScroll;

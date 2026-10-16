import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchEvents,
  fetchEvent,
  fetchPosts,
  fetchPost,
} from '../lib/contentClient.js';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  // In-memory cache maps
  const eventsCache = useRef(new Map());
  const eventDetailCache = useRef(new Map());
  const postsCache = useRef(new Map());
  const postDetailCache = useRef(new Map());

  const value = {
    eventsCache,
    eventDetailCache,
    postsCache,
    postDetailCache,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

function useIsPreview() {
  const [searchParams] = useSearchParams();
  return searchParams.get('preview') === '1';
}

/**
 * useEvents() hook
 */
export function useEvents() {
  const isPreview = useIsPreview();
  const context = useContext(ContentContext);
  const cacheKey = isPreview ? 'events-preview' : 'events-published';

  const [data, setData] = useState(() => {
    return context?.eventsCache.current.get(cacheKey) || null;
  });
  const [loading, setLoading] = useState(() => {
    return !context?.eventsCache.current.has(cacheKey);
  });
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (force = false) => {
      if (!force && context?.eventsCache.current.has(cacheKey)) {
        setData(context.eventsCache.current.get(cacheKey));
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const events = await fetchEvents(isPreview);
        if (context) {
          context.eventsCache.current.set(cacheKey, events);
        }
        setData(events);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, isPreview, context]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => loadData(true), [loadData]);

  return {
    data: data || [],
    loading,
    error,
    refresh,
  };
}

/**
 * useEvent(slug) hook
 */
export function useEvent(slug) {
  const isPreview = useIsPreview();
  const context = useContext(ContentContext);
  const cleanSlug = slug ? String(slug).trim().toLowerCase() : '';
  const cacheKey = `${cleanSlug}:${isPreview ? '1' : '0'}`;

  const [data, setData] = useState(() => {
    return context?.eventDetailCache.current.get(cacheKey) || null;
  });
  const [loading, setLoading] = useState(() => {
    return cleanSlug ? !context?.eventDetailCache.current.has(cacheKey) : false;
  });
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const loadEvent = useCallback(
    async (force = false) => {
      if (!cleanSlug) {
        setData(null);
        setLoading(false);
        return;
      }

      if (!force && context?.eventDetailCache.current.has(cacheKey)) {
        const cached = context.eventDetailCache.current.get(cacheKey);
        setData(cached);
        setLoading(false);
        setError(null);
        setNotFound(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const event = await fetchEvent(cleanSlug, isPreview);
        if (context) {
          context.eventDetailCache.current.set(cacheKey, event);
        }
        setData(event);
      } catch (err) {
        if (err.status === 404 || err.message === 'not_found') {
          setNotFound(true);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [cleanSlug, cacheKey, isPreview, context]
  );

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const refresh = useCallback(() => loadEvent(true), [loadEvent]);
  const isDraft = Boolean(data && data.status === 'draft' && isPreview);

  return {
    data,
    loading,
    error,
    notFound,
    isDraft,
    refresh,
  };
}

/**
 * usePosts() hook
 */
export function usePosts() {
  const isPreview = useIsPreview();
  const context = useContext(ContentContext);
  const cacheKey = isPreview ? 'posts-preview' : 'posts-published';

  const [data, setData] = useState(() => {
    return context?.postsCache.current.get(cacheKey) || null;
  });
  const [loading, setLoading] = useState(() => {
    return !context?.postsCache.current.has(cacheKey);
  });
  const [error, setError] = useState(null);

  const loadPosts = useCallback(
    async (force = false) => {
      if (!force && context?.postsCache.current.has(cacheKey)) {
        setData(context.postsCache.current.get(cacheKey));
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const posts = await fetchPosts(isPreview);
        if (context) {
          context.postsCache.current.set(cacheKey, posts);
        }
        setData(posts);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, isPreview, context]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const refresh = useCallback(() => loadPosts(true), [loadPosts]);

  return {
    data: data || [],
    loading,
    error,
    refresh,
  };
}

/**
 * usePost(slug) hook
 */
export function usePost(slug) {
  const isPreview = useIsPreview();
  const context = useContext(ContentContext);
  const cleanSlug = slug ? String(slug).trim().toLowerCase() : '';
  const cacheKey = `${cleanSlug}:${isPreview ? '1' : '0'}`;

  const [data, setData] = useState(() => {
    return context?.postDetailCache.current.get(cacheKey) || null;
  });
  const [loading, setLoading] = useState(() => {
    return cleanSlug ? !context?.postDetailCache.current.has(cacheKey) : false;
  });
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const loadPost = useCallback(
    async (force = false) => {
      if (!cleanSlug) {
        setData(null);
        setLoading(false);
        return;
      }

      if (!force && context?.postDetailCache.current.has(cacheKey)) {
        const cached = context.postDetailCache.current.get(cacheKey);
        setData(cached);
        setLoading(false);
        setError(null);
        setNotFound(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const post = await fetchPost(cleanSlug, isPreview);
        if (context) {
          context.postDetailCache.current.set(cacheKey, post);
        }
        setData(post);
      } catch (err) {
        if (err.status === 404 || err.message === 'not_found') {
          setNotFound(true);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [cleanSlug, cacheKey, isPreview, context]
  );

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const refresh = useCallback(() => loadPost(true), [loadPost]);
  const isDraft = Boolean(data && data.status === 'draft' && isPreview);

  return {
    data,
    loading,
    error,
    notFound,
    isDraft,
    refresh,
  };
}

/**
 * Fixed yellow banner for draft preview mode
 */
export function DraftPreviewBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 text-amber-950 px-4 py-2 text-center text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
      <span>Draft preview — not visible to the public.</span>
    </div>
  );
}

/**
 * Error state display with Retry button
 */
export function ContentError({ onRetry }) {
  return (
    <div className="bg-red-50/90 border border-red-200 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto my-8 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <p className="text-sm sm:text-base font-semibold text-red-900 mb-4">
        Couldn't load this content. Please refresh the page.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

/**
 * Loading skeletons
 */
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between animate-pulse">
      <div className="space-y-4">
        <div className="w-full aspect-[1024/765] bg-slate-100 rounded-xl" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-4/5" />
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-full" />
          <div className="h-3.5 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full aspect-video bg-slate-200 shrink-0" />
      <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-5 bg-slate-200 rounded w-4/5" />
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-full" />
          <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        </div>
        <div className="mt-auto pt-3 border-t border-slate-100 h-4 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  );
}

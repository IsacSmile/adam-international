import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Portal,
  useClose,
} from '@headlessui/react';
import { ChevronDown, Check, Search } from 'lucide-react';

/**
 * Normalizes an option item into { value, label }
 */
function normalizeOption(opt) {
  if (typeof opt === 'object' && opt !== null) {
    return {
      value: opt.value !== undefined ? String(opt.value) : '',
      label: opt.label !== undefined ? String(opt.label) : String(opt.value || ''),
    };
  }
  const str = String(opt ?? '');
  return { value: str, label: str };
}

/**
 * Removes diacritics/accents and converts to lowercase for accent-insensitive search
 */
function normalizeForSearch(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Search input component positioned inside the Listbox panel
 */
function SearchHeader({
  searchQuery,
  setSearchQuery,
  searchInputRef,
  onSelectFirst,
  placeholder,
}) {
  const close = useClose();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onSelectFirst(close);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const listbox =
        e.currentTarget.closest('[role="listbox"]') ||
        document.querySelector('[role="listbox"]');
      const firstOpt = listbox?.querySelector('[role="option"]');
      firstOpt?.focus?.();
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-white pb-1.5 pt-0.5 px-0.5 border-b border-slate-100 mb-1">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search countries…'}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A84C] text-slate-800 placeholder-slate-400"
        />
      </div>
    </div>
  );
}

/**
 * Desktop dropdown implementation wrapping Headless UI Listbox
 */
function DesktopListbox({
  open,
  elementId,
  className,
  error,
  selectedOption,
  placeholder,
  searchable,
  groups,
  filteredGroups,
  filteredOptions,
  showNotSure,
  notSureOption,
  totalFilteredCount,
  onSelectFirst,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (open && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
    if (!open) {
      setSearchQuery('');
    }
  }, [open, searchable]);

  // Compute filtered items dynamically based on current searchQuery
  const currentFilteredGroups = useMemo(() => {
    if (!filteredGroups) return null;
    if (!searchQuery.trim()) return filteredGroups;
    const q = normalizeForSearch(searchQuery);
    return filteredGroups
      .map((g) => ({
        label: g.label,
        options: g.options.filter((o) =>
          normalizeForSearch(o.label).includes(q)
        ),
      }))
      .filter((g) => g.options.length > 0);
  }, [filteredGroups, searchQuery]);

  const currentFilteredOptions = useMemo(() => {
    if (!filteredOptions) return null;
    if (!searchQuery.trim()) return filteredOptions;
    const q = normalizeForSearch(searchQuery);
    return filteredOptions.filter((o) =>
      normalizeForSearch(o.label).includes(q)
    );
  }, [filteredOptions, searchQuery]);

  const currentShowNotSure = useMemo(() => {
    if (!notSureOption) return false;
    if (!searchQuery.trim()) return true;
    return normalizeForSearch(notSureOption.label).includes(
      normalizeForSearch(searchQuery)
    );
  }, [notSureOption, searchQuery]);

  const currentFirstMatch = useMemo(() => {
    if (currentFilteredGroups) {
      for (const g of currentFilteredGroups) {
        if (g.options.length > 0) return g.options[0];
      }
    }
    if (currentFilteredOptions && currentFilteredOptions.length > 0) {
      return currentFilteredOptions[0];
    }
    if (currentShowNotSure && notSureOption) {
      return notSureOption;
    }
    return null;
  }, [currentFilteredGroups, currentFilteredOptions, currentShowNotSure, notSureOption]);

  const currentCount = useMemo(() => {
    let count = 0;
    if (currentFilteredGroups) {
      for (const g of currentFilteredGroups) {
        count += g.options.length;
      }
    }
    if (currentFilteredOptions) {
      count += currentFilteredOptions.length;
    }
    if (currentShowNotSure) {
      count += 1;
    }
    return count;
  }, [currentFilteredGroups, currentFilteredOptions, currentShowNotSure]);

  const handleSelectFirstMatch = (closeFn) => {
    if (currentFirstMatch) {
      onSelectFirst(currentFirstMatch.value);
      closeFn();
    }
  };

  return (
    <div className="relative w-full">
      <ListboxButton
        id={elementId}
        className={`w-full min-h-[44px] h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-400 focus:ring-rose-200'
            : 'border-slate-200 hover:border-slate-300 focus:ring-[#C9A84C]'
        } ${className}`}
      >
        <span
          className={`truncate ${
            selectedOption?.label ? 'text-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#C9A84C]' : ''
          }`}
        />
      </ListboxButton>

      <Portal>
        <ListboxOptions
          anchor={{ to: 'bottom start', gap: 4, offset: 0 }}
          transition
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="w-[var(--button-width)] max-h-[320px] overflow-y-auto rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 text-sm focus:outline-none z-[100] transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {searchable && (
            <SearchHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchInputRef={searchInputRef}
              onSelectFirst={handleSelectFirstMatch}
              placeholder={groups ? 'Search countries…' : 'Search options…'}
            />
          )}

          {currentCount === 0 && (
            <div className="py-6 text-center text-xs text-slate-400 select-none">
              No matches
            </div>
          )}

          {/* Grouped Options */}
          {currentFilteredGroups &&
            currentFilteredGroups.map((group) => (
              <div key={group.label} className="mb-2 last:mb-0">
                <div
                  className={`sticky ${
                    searchable ? 'top-[42px]' : 'top-0'
                  } z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none`}
                >
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.options.map((opt) => (
                    <ListboxOption
                      key={opt.value}
                      value={opt.value}
                      className="h-10 min-h-[40px] px-3 flex items-center justify-between text-sm cursor-pointer select-none rounded-lg transition-colors data-[focus]:bg-[#C9A84C]/15 text-slate-700 data-[selected]:font-semibold data-[selected]:text-[#0B1F3A]"
                    >
                      {({ selected }) => (
                        <>
                          <span className="truncate">{opt.label}</span>
                          {selected && (
                            <Check className="w-4 h-4 text-[#C9A84C] shrink-0 ml-2" />
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </div>
              </div>
            ))}

          {/* Flat Options */}
          {currentFilteredOptions && (
            <div className="space-y-0.5">
              {currentFilteredOptions.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className="h-10 min-h-[40px] px-3 flex items-center justify-between text-sm cursor-pointer select-none rounded-lg transition-colors data-[focus]:bg-[#C9A84C]/15 text-slate-700 data-[selected]:font-semibold data-[selected]:text-[#0B1F3A]"
                >
                  {({ selected }) => (
                    <>
                      <span className="truncate">{opt.label}</span>
                      {selected && (
                        <Check className="w-4 h-4 text-[#C9A84C] shrink-0 ml-2" />
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </div>
          )}

          {/* "Not sure yet" option separated by divider */}
          {currentShowNotSure && notSureOption && (
            <>
              {currentCount > 1 && (
                <div className="my-1.5 border-t border-slate-100" />
              )}
              <ListboxOption
                key={notSureOption.value}
                value={notSureOption.value}
                className="h-10 min-h-[40px] px-3 flex items-center justify-between text-sm cursor-pointer select-none rounded-lg transition-colors data-[focus]:bg-[#C9A84C]/15 text-slate-700 data-[selected]:font-semibold data-[selected]:text-[#0B1F3A]"
              >
                {({ selected }) => (
                  <>
                    <span className="truncate">{notSureOption.label}</span>
                    {selected && (
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0 ml-2" />
                    )}
                  </>
                )}
              </ListboxOption>
            </>
          )}
        </ListboxOptions>
      </Portal>
    </div>
  );
}

/**
 * SelectField: Accessible, Headless UI-powered dropdown on desktop,
 * styled native <select> on mobile & touch devices.
 */
export default function SelectField({
  name,
  label,
  value = '',
  onChange,
  options,
  groups,
  placeholder = 'Select option…',
  searchable = false,
  error,
  required = false,
  id,
  className = '',
  containerClassName = '',
  disabled = false,
}) {
  const elementId = id || name;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.innerWidth < 768 ||
        (('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
          window.innerWidth < 1024)
      );
    }
    return false;
  });

  // Detect mobile & touch devices for native picker
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      const isTouch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isNarrow || (isTouch && window.innerWidth < 1024));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Standardize options & groups
  const { parsedGroups, parsedOptions, notSureOption, allFlatOptions } =
    useMemo(() => {
      let flat = [];
      let notSure = null;

      let gList = null;
      if (groups && Array.isArray(groups)) {
        gList = groups.map((g) => {
          const opts = (g.options || [])
            .map(normalizeOption)
            .filter((o) => {
              if (
                o.value.toLowerCase() === 'not sure yet' ||
                o.label.toLowerCase() === 'not sure yet'
              ) {
                notSure = o;
                return false;
              }
              return true;
            });
          flat.push(...opts);
          return { label: g.label, options: opts };
        });
      }

      let oList = null;
      if (options && Array.isArray(options)) {
        oList = options
          .map(normalizeOption)
          .filter((o) => {
            if (
              o.value.toLowerCase() === 'not sure yet' ||
              o.label.toLowerCase() === 'not sure yet'
            ) {
              notSure = o;
              return false;
            }
            return true;
          });
        flat.push(...oList);
      }

      if (notSure) {
        flat.push(notSure);
      }

      return {
        parsedGroups: gList,
        parsedOptions: oList,
        notSureOption: notSure,
        allFlatOptions: flat,
      };
    }, [groups, options]);

  // Find currently selected option label
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    const strVal = String(value);
    return (
      allFlatOptions.find(
        (o) => o.value === strVal || o.label === strVal
      ) || null
    );
  }, [allFlatOptions, value]);

  // Propagate change event matching native event structure
  const handleValueChange = (newVal) => {
    if (onChange) {
      onChange({ target: { name, value: newVal } });
    }
  };

  // Render Label
  const labelElement = label ? (
    <label
      htmlFor={elementId}
      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
    >
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
  ) : null;

  // Render Error
  const errorElement = error ? (
    <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>
  ) : null;

  // ==========================================
  // MOBILE (< 768px): Native <select> with styling
  // ==========================================
  if (isMobile) {
    return (
      <div className={`w-full ${containerClassName}`}>
        {labelElement}
        <div className="relative w-full">
          <select
            id={elementId}
            name={name}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            required={required}
            className={`w-full min-h-[44px] h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white pr-10 focus:outline-none focus:ring-2 appearance-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed ${
              error
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:ring-[#C9A84C]'
            } ${className}`}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {parsedGroups ? (
              <>
                {parsedGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                {notSureOption && (
                  <option value={notSureOption.value}>
                    {notSureOption.label}
                  </option>
                )}
              </>
            ) : (
              parsedOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            )}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {errorElement}
      </div>
    );
  }

  // ==========================================
  // DESKTOP (>= 768px): Headless UI Listbox
  // ==========================================
  return (
    <div className={`w-full ${containerClassName}`}>
      {labelElement}
      {/* Hidden input to guarantee form submission / payload compatibility */}
      <input type="hidden" name={name} value={value || ''} />

      <Listbox
        value={value || ''}
        onChange={handleValueChange}
        disabled={disabled}
      >
        {({ open }) => (
          <DesktopListbox
            open={open}
            elementId={elementId}
            className={className}
            error={error}
            selectedOption={selectedOption}
            placeholder={placeholder}
            searchable={searchable}
            groups={groups}
            filteredGroups={parsedGroups}
            filteredOptions={parsedOptions}
            showNotSure={Boolean(notSureOption)}
            notSureOption={notSureOption}
            onSelectFirst={handleValueChange}
          />
        )}
      </Listbox>
      {errorElement}
    </div>
  );
}

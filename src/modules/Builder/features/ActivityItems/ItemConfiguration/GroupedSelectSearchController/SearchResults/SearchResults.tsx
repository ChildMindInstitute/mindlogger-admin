import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchResultsProps } from './SearchResults.types';

export const SearchResults = ({ options, searchTerm }: SearchResultsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {options.map((result) => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = t(result.value).split(regex);

        return (
          <div>
            {parts.map((part, i) => (
              <Fragment key={i}>
                {part.match(regex) ? <mark>{part}</mark> : <span>{part}</span>}
              </Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

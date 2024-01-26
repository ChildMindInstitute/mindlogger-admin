import { useEffect } from 'react';

type LookupTableUploaderProps = {
  onFileReady: (data: { name: string; data: Record<string, string | number>[] }) => void;
};

const lookupTableFileData = {
  name: 'subscale_lookup_table_template (12).csv',
  data: [
    {
      score: '10',
      rawScore: '1',
      age: '15',
      sex: 'M',
      optionalText:
        'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
    },
    {
      score: '20',
      rawScore: '2',
      age: '15',
      sex: 'M',
      optionalText:
        'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
    },
    {
      score: '30',
      rawScore: '3',
      age: '15',
      sex: 'M',
      optionalText: 'Markdown Text Here',
    },
    {
      score: '40',
      rawScore: '4',
      age: '15',
      sex: 'F',
      optionalText: 'Good',
    },
    {
      score: '50',
      rawScore: '5',
      age: '15',
      sex: '',
      optionalText: '',
    },
  ],
};

export const FileUploader = ({ onFileReady }: LookupTableUploaderProps) => {
  useEffect(() => {
    onFileReady(lookupTableFileData);
  }, []);

  return null;
};

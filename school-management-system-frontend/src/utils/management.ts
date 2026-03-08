export interface SelectOption {
  label: string;
  value: string;
}

export interface IdLike {
  id?: string;
  _id?: string;
}

export const getEntityId = (item: IdLike | null | undefined) => item?._id ?? item?.id ?? '';

export const splitCommaSeparated = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const joinCommaSeparated = (value: Array<string | number> | null | undefined) =>
  Array.isArray(value) ? value.join(', ') : '';

export const formatDateForInput = (value?: string | null) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const buildOptions = <TItem>(
  items: TItem[],
  getValue: (item: TItem) => string,
  getLabel: (item: TItem) => string
): SelectOption[] =>
  items
    .map((item) => ({
      value: getValue(item),
      label: getLabel(item),
    }))
    .filter((option) => option.value);

export const dayOptions: SelectOption[] = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

export const getDayLabel = (value?: number | string | null) => {
  const option = dayOptions.find((item) => item.value === String(value ?? ''));
  return option?.label ?? 'Unknown';
};

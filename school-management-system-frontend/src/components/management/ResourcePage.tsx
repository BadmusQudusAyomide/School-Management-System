import React, { useEffect, useMemo, useState } from 'react';
import DashboardState from '../dashboard/DashboardState';
import { api } from '../../lib/api';

export interface ResourceFieldOption {
  label: string;
  value: string;
}

export interface ResourceFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  options?: ResourceFieldOption[];
}

export interface ResourceColumnConfig<TItem> {
  key: string;
  label: string;
  render: (item: TItem) => React.ReactNode;
}

interface ResourcePageProps<TItem> {
  title: string;
  description: string;
  endpoint: string;
  columns: ResourceColumnConfig<TItem>[];
  fields: ResourceFieldConfig[];
  getId: (item: TItem) => string;
  toFormValues?: (item: TItem) => Record<string, string>;
  toPayload?: (values: Record<string, string>) => Record<string, unknown>;
  fromListResponse?: (data: unknown) => TItem[];
  canWrite?: boolean;
  readOnlyMessage?: string;
}

const ResourcePage = <TItem,>({
  title,
  description,
  endpoint,
  columns,
  fields,
  getId,
  toFormValues,
  toPayload,
  fromListResponse,
  canWrite = true,
  readOnlyMessage = 'You can view these records, but your role cannot create or modify them.',
}: ResourcePageProps<TItem>) => {
  const initialValues = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, ''])),
    [fields]
  );

  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);

  const hydrateItems = (data: unknown) =>
    fromListResponse ? fromListResponse(data) : ((data as TItem[]) ?? []);

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(endpoint);
      setItems(hydrateItems(response.data.data));
    } catch (fetchError) {
      console.error(fetchError);
      setError(`Failed to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [endpoint]);

  const resetForm = () => {
    setEditingItem(null);
    setFormValues(initialValues);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = toPayload ? toPayload(formValues) : formValues;
      if (editingItem) {
        await api.put(`${endpoint}/${getId(editingItem)}`, payload);
      } else {
        await api.post(endpoint, payload);
      }
      resetForm();
      await loadItems();
    } catch (submitError) {
      console.error(submitError);
      setError(`Failed to save ${title.toLowerCase()} data.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: TItem) => {
    setError('');
    try {
      await api.delete(`${endpoint}/${getId(item)}`);
      if (editingItem && getId(editingItem) === getId(item)) {
        resetForm();
      }
      await loadItems();
    } catch (deleteError) {
      console.error(deleteError);
      setError(`Failed to delete ${title.toLowerCase()} record.`);
    }
  };

  if (loading) {
    return <DashboardState title={`Loading ${title}`} message={`Fetching ${title.toLowerCase()} data...`} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-white/70 mt-2">{description}</p>
      </div>

      {error && <DashboardState title={`${title} Error`} message={error} actionLabel="Reload" onAction={() => void loadItems()} />}

      <div className={`grid grid-cols-1 gap-6 ${canWrite ? 'xl:grid-cols-[1.2fr_0.8fr]' : ''}`}>
        <div className="card-glassmorphism overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Records</h3>
            {canWrite ? (
              <button type="button" onClick={resetForm} className="btn-primary px-4 py-2 rounded-lg">
                New Record
              </button>
            ) : null}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/60 border-b border-white/10">
                {columns.map((column) => (
                  <th key={column.key} className="py-3 pr-4 font-medium">{column.label}</th>
                ))}
                {canWrite ? <th className="py-3 font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map((item) => (
                <tr key={getId(item)} className="border-b border-white/5 align-top">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 pr-4 text-white">{column.render(item)}</td>
                  ))}
                  {canWrite ? (
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setFormValues(toFormValues ? toFormValues(item) : initialValues);
                          }}
                          className="px-3 py-1 rounded-lg bg-white/10 text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          className="px-3 py-1 rounded-lg bg-red-500/20 text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + (canWrite ? 1 : 0)} className="py-8 text-center text-white/60">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {canWrite ? (
          <div className="card-glassmorphism">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingItem ? 'Edit Record' : 'Create Record'}
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm text-white/70 mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formValues[field.name] ?? ''}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, [field.name]: event.target.value }))
                      }
                      required={field.required}
                      placeholder={field.placeholder}
                      className="input-glassmorphism w-full min-h-24"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formValues[field.name] ?? ''}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, [field.name]: event.target.value }))
                      }
                      required={field.required}
                      className="input-glassmorphism w-full"
                    >
                      <option value="">Select {field.label}</option>
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    <select
                      multiple
                      value={(formValues[field.name] ?? '').split(',').filter(Boolean)}
                      onChange={(event) =>
                        setFormValues((current) => ({
                          ...current,
                          [field.name]: Array.from(event.target.selectedOptions).map((option) => option.value).join(','),
                        }))
                      }
                      required={field.required}
                      className="input-glassmorphism w-full min-h-36"
                    >
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type ?? 'text'}
                      value={formValues[field.name] ?? ''}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, [field.name]: event.target.value }))
                      }
                      required={field.required}
                      placeholder={field.placeholder}
                      className="input-glassmorphism w-full"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary px-4 py-2 rounded-lg">
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-white/10 text-white">
                  Reset
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card-glassmorphism">
            <h3 className="text-lg font-semibold text-white mb-4">Read-Only Access</h3>
            <p className="text-white/70 leading-7">{readOnlyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;

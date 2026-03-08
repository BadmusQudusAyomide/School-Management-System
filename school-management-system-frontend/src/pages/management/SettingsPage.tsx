import React from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import { getEntityId } from '../../utils/management';

interface SettingRecord {
  _id?: string;
  key?: string;
  value?: string;
  description?: string;
  updatedAt?: string;
}

const SettingsPage: React.FC = () => (
  <ResourcePage<SettingRecord>
    title="Settings"
    description="Manage system configuration keys and their school-specific values."
    endpoint="/settings"
    getId={(item) => getEntityId(item)}
    columns={[
      {
        key: 'key',
        label: 'Key',
        render: (item) => item.key ?? 'N/A',
      },
      {
        key: 'value',
        label: 'Value',
        render: (item) => item.value ?? 'N/A',
      },
      {
        key: 'description',
        label: 'Description',
        render: (item) => item.description ?? 'N/A',
      },
      {
        key: 'updatedAt',
        label: 'Updated',
        render: (item) => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'),
      },
    ]}
    fields={[
      {
        name: 'key',
        label: 'Key',
        required: true,
        placeholder: 'school_name',
      },
      {
        name: 'value',
        label: 'Value',
        type: 'textarea',
        required: true,
        placeholder: 'Greenfield High School',
      },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Optional setting description',
      },
    ]}
    toFormValues={(item) => ({
      key: item.key ?? '',
      value: item.value ?? '',
      description: item.description ?? '',
    })}
  />
);

export default SettingsPage;

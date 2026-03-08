import React from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import { getEntityId } from '../../utils/management';

interface ReportRecord {
  _id?: string;
  title?: string;
  type?: string;
  period?: string;
  summary?: string;
  createdAt?: string;
}

const ReportsPage: React.FC = () => (
  <ResourcePage<ReportRecord>
    title="Reports"
    description="Maintain attendance, finance, academic, and custom reports for the school."
    endpoint="/reports"
    getId={(item) => getEntityId(item)}
    columns={[
      {
        key: 'title',
        label: 'Title',
        render: (item) => item.title ?? 'Untitled report',
      },
      {
        key: 'type',
        label: 'Type',
        render: (item) => item.type ?? 'N/A',
      },
      {
        key: 'period',
        label: 'Period',
        render: (item) => item.period ?? 'N/A',
      },
      {
        key: 'createdAt',
        label: 'Created',
        render: (item) => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'),
      },
    ]}
    fields={[
      {
        name: 'title',
        label: 'Title',
        required: true,
        placeholder: 'Monthly Fee Summary',
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
          { value: 'attendance', label: 'Attendance' },
          { value: 'finance', label: 'Finance' },
          { value: 'academic', label: 'Academic' },
          { value: 'custom', label: 'Custom' },
        ],
      },
      {
        name: 'period',
        label: 'Period',
        placeholder: 'January 2026',
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        placeholder: 'Add the report summary here.',
      },
    ]}
    toFormValues={(item) => ({
      title: item.title ?? '',
      type: item.type ?? '',
      period: item.period ?? '',
      summary: item.summary ?? '',
    })}
  />
);

export default ReportsPage;

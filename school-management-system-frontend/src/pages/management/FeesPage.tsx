import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, formatDateForInput, getEntityId } from '../../utils/management';

interface StudentRecord {
  _id?: string;
  userId?: {
    name?: string;
  };
}

interface FeeRecord {
  _id?: string;
  student?: StudentRecord;
  amount?: number;
  paid?: number;
  status?: string;
  dueDate?: string;
}

const FeesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>([]);

  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        setStudents(await referenceDataService.listStudents() as StudentRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load fee reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, []);

  if (loading) {
    return <DashboardState title="Loading fees" message="Preparing fee management tools..." />;
  }

  if (error) {
    return <DashboardState title="Fees unavailable" message={error} />;
  }

  return (
    <ResourcePage<FeeRecord>
      title="Fees"
      description="Create fee records, track balances, and maintain payment status."
      endpoint="/fees"
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'student',
          label: 'Student',
          render: (item) => item.student?.userId?.name ?? 'Unknown student',
        },
        {
          key: 'amount',
          label: 'Amount',
          render: (item) => `$${Number(item.amount ?? 0).toLocaleString()}`,
        },
        {
          key: 'paid',
          label: 'Paid',
          render: (item) => `$${Number(item.paid ?? 0).toLocaleString()}`,
        },
        {
          key: 'status',
          label: 'Status',
          render: (item) => item.status ?? 'pending',
        },
        {
          key: 'dueDate',
          label: 'Due Date',
          render: (item) => (item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'),
        },
      ]}
      fields={[
        {
          name: 'student',
          label: 'Student',
          type: 'select',
          required: true,
          options: buildOptions(students, (item) => getEntityId(item), (item) => item.userId?.name ?? 'Unknown student'),
        },
        {
          name: 'amount',
          label: 'Amount',
          type: 'number',
          required: true,
          placeholder: '100000',
        },
        {
          name: 'paid',
          label: 'Paid',
          type: 'number',
          placeholder: '0',
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'partial', label: 'Partial' },
            { value: 'paid', label: 'Paid' },
            { value: 'overdue', label: 'Overdue' },
          ],
        },
        {
          name: 'dueDate',
          label: 'Due Date',
          type: 'date',
          required: true,
        },
      ]}
      toFormValues={(item) => ({
        student: getEntityId(item.student),
        amount: item.amount !== undefined ? String(item.amount) : '',
        paid: item.paid !== undefined ? String(item.paid) : '',
        status: item.status ?? 'pending',
        dueDate: formatDateForInput(item.dueDate),
      })}
      toPayload={(values) => ({
        ...values,
        amount: Number(values.amount),
        paid: Number(values.paid || 0),
      })}
    />
  );
};

export default FeesPage;

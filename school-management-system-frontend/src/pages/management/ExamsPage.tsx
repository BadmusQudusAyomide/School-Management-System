import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, formatDateForInput, getEntityId, joinCommaSeparated, splitCommaSeparated } from '../../utils/management';

interface ClassRecord {
  _id?: string;
  name?: string;
  section?: string;
}

interface ExamRecord {
  _id?: string;
  name?: string;
  class?: ClassRecord;
  subjects?: string[];
  date?: string;
}

const ExamsPage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin' || user?.role === 'teacher';
  const [loading, setLoading] = useState(canWrite);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState<ClassRecord[]>([]);

  useEffect(() => {
    if (!canWrite) {
      return;
    }

    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        setClasses(await referenceDataService.listClasses() as ClassRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load exam reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, [canWrite]);

  if (loading) {
    return <DashboardState title="Loading exams" message="Preparing exam management tools..." />;
  }

  if (error) {
    return <DashboardState title="Exams unavailable" message={error} />;
  }

  return (
    <ResourcePage<ExamRecord>
      title="Exams"
      description="Plan exam sessions, assign classes, and manage subject coverage."
      endpoint="/exams"
      canWrite={canWrite}
      readOnlyMessage="Students and parents can review exam schedules here, but only teachers and administrators can modify them."
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'name',
          label: 'Exam',
          render: (item) => item.name ?? 'Untitled exam',
        },
        {
          key: 'class',
          label: 'Class',
          render: (item) => `${item.class?.name ?? 'N/A'} ${item.class?.section ?? ''}`.trim(),
        },
        {
          key: 'subjects',
          label: 'Subjects',
          render: (item) => joinCommaSeparated(item.subjects) || 'N/A',
        },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : 'N/A'),
        },
      ]}
      fields={[
        {
          name: 'name',
          label: 'Exam Name',
          required: true,
          placeholder: 'Midterm Examination',
        },
        {
          name: 'class',
          label: 'Class',
          type: 'select',
          required: true,
          options: buildOptions(classes, (item) => getEntityId(item), (item) => `${item.name ?? 'Class'} ${item.section ?? ''}`.trim()),
        },
        {
          name: 'subjects',
          label: 'Subjects',
          type: 'textarea',
          required: true,
          placeholder: 'Mathematics, English, Biology',
        },
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
        },
      ]}
      toFormValues={(item) => ({
        name: item.name ?? '',
        class: getEntityId(item.class),
        subjects: joinCommaSeparated(item.subjects),
        date: formatDateForInput(item.date),
      })}
      toPayload={(values) => ({
        ...values,
        subjects: splitCommaSeparated(values.subjects),
      })}
    />
  );
};

export default ExamsPage;

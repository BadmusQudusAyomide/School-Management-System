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

interface ClassRecord {
  _id?: string;
  name?: string;
  section?: string;
}

interface AttendanceRecord {
  _id?: string;
  student?: StudentRecord;
  class?: ClassRecord;
  date?: string;
  status?: string;
}

const AttendancePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);

  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [studentResponse, classResponse] = await Promise.all([
          referenceDataService.listStudents(),
          referenceDataService.listClasses(),
        ]);

        setStudents(studentResponse as StudentRecord[]);
        setClasses(classResponse as ClassRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load attendance reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, []);

  if (loading) {
    return <DashboardState title="Loading attendance" message="Preparing attendance management tools..." />;
  }

  if (error) {
    return <DashboardState title="Attendance unavailable" message={error} />;
  }

  return (
    <ResourcePage<AttendanceRecord>
      title="Attendance"
      description="Mark, update, and review class attendance records."
      endpoint="/attendance"
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'student',
          label: 'Student',
          render: (item) => item.student?.userId?.name ?? 'Unknown student',
        },
        {
          key: 'class',
          label: 'Class',
          render: (item) => `${item.class?.name ?? 'N/A'} ${item.class?.section ?? ''}`.trim(),
        },
        {
          key: 'date',
          label: 'Date',
          render: (item) => (item.date ? new Date(item.date).toLocaleDateString() : 'N/A'),
        },
        {
          key: 'status',
          label: 'Status',
          render: (item) => item.status ?? 'N/A',
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
          name: 'class',
          label: 'Class',
          type: 'select',
          required: true,
          options: buildOptions(classes, (item) => getEntityId(item), (item) => `${item.name ?? 'Class'} ${item.section ?? ''}`.trim()),
        },
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { value: 'present', label: 'Present' },
            { value: 'absent', label: 'Absent' },
            { value: 'late', label: 'Late' },
            { value: 'excused', label: 'Excused' },
          ],
        },
      ]}
      toFormValues={(item) => ({
        student: getEntityId(item.student),
        class: getEntityId(item.class),
        date: formatDateForInput(item.date),
        status: item.status ?? '',
      })}
    />
  );
};

export default AttendancePage;

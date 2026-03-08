import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, getEntityId, joinCommaSeparated, splitCommaSeparated } from '../../utils/management';

interface TeacherRecord {
  _id?: string;
  userId?: {
    name?: string;
  };
}

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
  teacher?: TeacherRecord;
  students?: StudentRecord[];
}

const ClassesPage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  useEffect(() => {
    if (!canWrite) {
      return;
    }

    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [teacherResponse, studentResponse] = await Promise.all([
          referenceDataService.listTeachers(),
          referenceDataService.listStudents(),
        ]);

        setTeachers(teacherResponse as TeacherRecord[]);
        setStudents(studentResponse as StudentRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load class reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, [canWrite]);

  if (loading) {
    return (
      <div className="space-y-4">
        {error ? <DashboardState title="Class references unavailable" message={error} /> : null}
        <ResourcePage<ClassRecord>
          title="Class Management"
          description="Configure classes, assign class teachers, and manage student rosters. Section means the stream or arm of a class, like A or B."
          endpoint="/classes"
          canWrite={canWrite}
          readOnlyMessage="Teachers can view class allocations here, but only administrators can change the class structure."
          getId={(item) => getEntityId(item)}
          columns={[
            {
              key: 'name',
              label: 'Class',
              render: (item) => `${item.name ?? 'N/A'} ${item.section ?? ''}`.trim(),
            },
            {
              key: 'teacher',
              label: 'Teacher',
              render: (item) => item.teacher?.userId?.name ?? 'Unassigned',
            },
            {
              key: 'students',
              label: 'Students',
              render: (item) => String(item.students?.length ?? 0),
            },
          ]}
          fields={[]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <DashboardState title="Class references unavailable" message={error} /> : null}
      <ResourcePage<ClassRecord>
        title="Class Management"
        description="Configure classes, assign class teachers, and manage student rosters. Section means the stream or arm of a class, like A or B."
        endpoint="/classes"
        canWrite={canWrite}
        readOnlyMessage="Teachers can view class allocations here, but only administrators can change the class structure."
        getId={(item) => getEntityId(item)}
        columns={[
          {
            key: 'name',
            label: 'Class',
            render: (item) => `${item.name ?? 'N/A'} ${item.section ?? ''}`.trim(),
          },
          {
            key: 'teacher',
            label: 'Teacher',
            render: (item) => item.teacher?.userId?.name ?? 'Unassigned',
          },
          {
            key: 'students',
            label: 'Students',
            render: (item) => String(item.students?.length ?? 0),
          },
        ]}
        fields={[
          {
            name: 'name',
            label: 'Class Name',
            required: true,
            placeholder: 'Grade 10',
          },
          {
            name: 'section',
            label: 'Section',
            required: true,
            placeholder: 'A, B, or C',
          },
          {
            name: 'teacher',
            label: 'Teacher',
            type: 'select',
            required: true,
            options: buildOptions(teachers, (item) => getEntityId(item), (item) => item.userId?.name ?? 'Unknown teacher'),
          },
          {
            name: 'students',
            label: 'Students',
            type: 'multiselect',
            options: buildOptions(students, (item) => getEntityId(item), (item) => item.userId?.name ?? 'Student'),
          },
        ]}
        toFormValues={(item) => ({
          name: item.name ?? '',
          section: item.section ?? '',
          teacher: getEntityId(item.teacher),
          students: (item.students?.map((student) => getEntityId(student)) ?? []).join(','),
        })}
        toPayload={(values) => ({
          ...values,
          students: splitCommaSeparated(values.students),
        })}
      />
    </div>
  );
};

export default ClassesPage;

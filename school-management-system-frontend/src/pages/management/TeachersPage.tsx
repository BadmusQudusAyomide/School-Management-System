import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, getEntityId, joinCommaSeparated, splitCommaSeparated } from '../../utils/management';

interface UserRecord {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ClassRecord {
  _id?: string;
  name?: string;
  section?: string;
}

interface TeacherRecord {
  _id?: string;
  userId?: UserRecord;
  employeeId?: string;
  subjects?: string[];
  classes?: ClassRecord[];
  qualification?: string;
  salary?: number;
}

const TeachersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherUsers, setTeacherUsers] = useState<UserRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);

  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [users, classesResponse] = await Promise.all([
          referenceDataService.listUsers(),
          referenceDataService.listClasses(),
        ]);

        setTeacherUsers(users.filter((item) => item.role === 'teacher') as UserRecord[]);
        setClasses(classesResponse as ClassRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load teacher reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, []);

  if (loading) {
    return <DashboardState title="Loading teachers" message="Preparing teacher management tools..." />;
  }

  if (error) {
    return <DashboardState title="Teachers unavailable" message={error} />;
  }

  return (
    <ResourcePage<TeacherRecord>
      title="Teachers Management"
      description="Maintain teacher profiles, assignments, and payroll metadata."
      endpoint="/teachers"
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'teacher',
          label: 'Teacher',
          render: (item) => (
            <div>
              <p className="font-medium">{item.userId?.name ?? 'Unknown teacher'}</p>
              <p className="text-xs text-white/60">{item.userId?.email ?? 'No email'}</p>
            </div>
          ),
        },
        {
          key: 'employeeId',
          label: 'Employee ID',
          render: (item) => item.employeeId ?? 'N/A',
        },
        {
          key: 'subjects',
          label: 'Subjects',
          render: (item) => joinCommaSeparated(item.subjects) || 'N/A',
        },
        {
          key: 'qualification',
          label: 'Qualification',
          render: (item) => item.qualification ?? 'N/A',
        },
        {
          key: 'salary',
          label: 'Salary',
          render: (item) => (item.salary !== undefined ? `$${Number(item.salary).toLocaleString()}` : 'N/A'),
        },
      ]}
      fields={[
        {
          name: 'userId',
          label: 'Teacher User',
          type: 'select',
          required: true,
          options: buildOptions(teacherUsers, (item) => getEntityId(item), (item) => `${item.name ?? 'Unknown'} (${item.email ?? 'No email'})`),
        },
        {
          name: 'employeeId',
          label: 'Employee ID',
          required: true,
          placeholder: 'EMP-001',
        },
        {
          name: 'subjects',
          label: 'Subjects',
          type: 'textarea',
          placeholder: 'Mathematics, Physics',
        },
        {
          name: 'classes',
          label: 'Assigned Class IDs',
          type: 'textarea',
          placeholder: classes.map((item) => `${item.name} ${item.section ?? ''} (${getEntityId(item)})`).join(', '),
        },
        {
          name: 'qualification',
          label: 'Qualification',
          required: true,
          placeholder: 'B.Ed, M.Sc',
        },
        {
          name: 'salary',
          label: 'Salary',
          type: 'number',
          required: true,
          placeholder: '50000',
        },
      ]}
      toFormValues={(item) => ({
        userId: getEntityId(item.userId),
        employeeId: item.employeeId ?? '',
        subjects: joinCommaSeparated(item.subjects),
        classes: joinCommaSeparated(item.classes?.map((classItem) => getEntityId(classItem))),
        qualification: item.qualification ?? '',
        salary: item.salary !== undefined ? String(item.salary) : '',
      })}
      toPayload={(values) => ({
        ...values,
        salary: Number(values.salary),
        subjects: splitCommaSeparated(values.subjects),
        classes: splitCommaSeparated(values.classes),
      })}
    />
  );
};

export default TeachersPage;

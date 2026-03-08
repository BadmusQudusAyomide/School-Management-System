import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, formatDateForInput, getEntityId } from '../../utils/management';

interface UserRecord {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ParentRecord {
  _id?: string;
  userId?: string | UserRecord;
}

interface ClassRecord {
  _id?: string;
  name?: string;
  section?: string;
}

interface StudentRecord {
  _id?: string;
  userId?: UserRecord;
  admissionNumber?: string;
  class?: ClassRecord;
  section?: string;
  dateOfBirth?: string;
  gender?: string;
  parentId?: ParentRecord;
  address?: string;
  feesStatus?: string;
}

const StudentsPage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentUsers, setStudentUsers] = useState<UserRecord[]>([]);
  const [parentUsers, setParentUsers] = useState<UserRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);

  useEffect(() => {
    if (!canWrite) {
      return;
    }

    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [users, classesResponse] = await Promise.all([
          referenceDataService.listUsers(),
          referenceDataService.listClasses(),
        ]);

        setStudentUsers(users.filter((item) => item.role === 'student') as UserRecord[]);
        setParentUsers(users.filter((item) => item.role === 'parent') as UserRecord[]);
        setClasses(classesResponse as ClassRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load student reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, [canWrite]);

  if (loading) {
    return (
      <div className="space-y-4">
        {error ? <DashboardState title="Student references unavailable" message={error} /> : null}
        <ResourcePage<StudentRecord>
          title="Students Management"
          description="Create, update, and review student enrollment records. Admission numbers are generated automatically in sequence."
          endpoint="/students"
          canWrite={canWrite}
          readOnlyMessage="Teachers can review student records here, but only administrators can create, edit, or delete them."
          getId={(item) => getEntityId(item)}
          columns={[
            {
              key: 'student',
              label: 'Student',
              render: (item) => (
                <div>
                  <p className="font-medium">{item.userId?.name ?? 'Unknown student'}</p>
                  <p className="text-xs text-white/60">{item.userId?.email ?? 'No email'}</p>
                </div>
              ),
            },
            {
              key: 'admissionNumber',
              label: 'Admission No.',
              render: (item) => item.admissionNumber ?? 'N/A',
            },
            {
              key: 'class',
              label: 'Class',
              render: (item) => `${item.class?.name ?? 'N/A'} ${item.section ?? item.class?.section ?? ''}`.trim(),
            },
            {
              key: 'gender',
              label: 'Gender',
              render: (item) => item.gender ?? 'N/A',
            },
            {
              key: 'feesStatus',
              label: 'Fees',
              render: (item) => item.feesStatus ?? 'pending',
            },
          ]}
          fields={[]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <DashboardState title="Student references unavailable" message={error} /> : null}
      <ResourcePage<StudentRecord>
        title="Students Management"
        description="Create, update, and review student enrollment records. Admission numbers are generated automatically in sequence."
        endpoint="/students"
        canWrite={canWrite}
        readOnlyMessage="Teachers can review student records here, but only administrators can create, edit, or delete them."
        getId={(item) => getEntityId(item)}
        columns={[
          {
            key: 'student',
            label: 'Student',
            render: (item) => (
              <div>
                <p className="font-medium">{item.userId?.name ?? 'Unknown student'}</p>
                <p className="text-xs text-white/60">{item.userId?.email ?? 'No email'}</p>
              </div>
            ),
          },
          {
            key: 'admissionNumber',
            label: 'Admission No.',
            render: (item) => item.admissionNumber ?? 'N/A',
          },
          {
            key: 'class',
            label: 'Class',
            render: (item) => `${item.class?.name ?? 'N/A'} ${item.section ?? item.class?.section ?? ''}`.trim(),
          },
          {
            key: 'gender',
            label: 'Gender',
            render: (item) => item.gender ?? 'N/A',
          },
          {
            key: 'feesStatus',
            label: 'Fees',
            render: (item) => item.feesStatus ?? 'pending',
          },
        ]}
        fields={[
          {
            name: 'userId',
            label: 'Student User',
            type: 'select',
            required: true,
            options: buildOptions(studentUsers, (item) => getEntityId(item), (item) => `${item.name ?? 'Unknown'} (${item.email ?? 'No email'})`),
          },
          {
            name: 'class',
            label: 'Class',
            type: 'select',
            required: true,
            options: buildOptions(classes, (item) => getEntityId(item), (item) => `${item.name ?? 'Class'} ${item.section ?? ''}`.trim()),
          },
          {
            name: 'section',
            label: 'Section',
            required: true,
            placeholder: 'A',
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            required: true,
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ],
          },
          {
            name: 'parentId',
            label: 'Parent User',
            type: 'select',
            required: true,
            options: buildOptions(parentUsers, (item) => getEntityId(item), (item) => `${item.name ?? 'Unknown'} (${item.email ?? 'No email'})`),
          },
          {
            name: 'address',
            label: 'Address',
            type: 'textarea',
            required: true,
            placeholder: 'Student address',
          },
          {
            name: 'feesStatus',
            label: 'Fees Status',
            type: 'select',
            options: [
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'partial', label: 'Partial' },
              { value: 'overdue', label: 'Overdue' },
            ],
          },
        ]}
        toFormValues={(item) => ({
          userId: getEntityId(item.userId),
          class: getEntityId(item.class),
          section: item.section ?? '',
          dateOfBirth: formatDateForInput(item.dateOfBirth),
          gender: item.gender ?? '',
          parentId:
            typeof item.parentId?.userId === 'string'
              ? item.parentId.userId
              : getEntityId(item.parentId?.userId as UserRecord | undefined),
          address: item.address ?? '',
          feesStatus: item.feesStatus ?? 'pending',
        })}
      />
    </div>
  );
};

export default StudentsPage;

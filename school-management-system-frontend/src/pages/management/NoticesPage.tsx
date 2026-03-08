import React from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import { useAuth } from '../../contexts/AuthContext';
import { getEntityId } from '../../utils/management';

interface NoticeRecord {
  _id?: string;
  title?: string;
  description?: string;
  targetRole?: string;
  createdAt?: string;
}

const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <ResourcePage<NoticeRecord>
      title="Notices"
      description="Publish school-wide notices and target announcements by role."
      endpoint="/notices"
      canWrite={canWrite}
      readOnlyMessage="Students and parents can review school notices here, but only teachers and administrators can manage them."
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (item) => item.title ?? 'Untitled notice',
        },
        {
          key: 'description',
          label: 'Description',
          render: (item) => item.description ?? 'No description',
        },
        {
          key: 'targetRole',
          label: 'Target Role',
          render: (item) => item.targetRole ?? 'N/A',
        },
        {
          key: 'createdAt',
          label: 'Published',
          render: (item) => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'),
        },
      ]}
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'School Assembly',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          placeholder: 'Share the full notice text here.',
        },
        {
          name: 'targetRole',
          label: 'Target Role',
          type: 'select',
          required: true,
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'teacher', label: 'Teacher' },
            { value: 'student', label: 'Student' },
            { value: 'parent', label: 'Parent' },
            { value: 'accountant', label: 'Accountant' },
          ],
        },
      ]}
      toFormValues={(item) => ({
        title: item.title ?? '',
        description: item.description ?? '',
        targetRole: item.targetRole ?? '',
      })}
    />
  );
};

export default NoticesPage;

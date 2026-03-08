import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, dayOptions, getDayLabel, getEntityId } from '../../utils/management';

interface TeacherRecord {
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

interface TimetableRecord {
  _id?: string;
  class?: ClassRecord;
  teacher?: TeacherRecord;
  subject?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  room?: string;
}

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin' || user?.role === 'teacher';
  const [loading, setLoading] = useState(canWrite);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);

  useEffect(() => {
    if (!canWrite) {
      return;
    }

    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [teacherResponse, classResponse] = await Promise.all([
          referenceDataService.listTeachers(),
          referenceDataService.listClasses(),
        ]);

        setTeachers(teacherResponse as TeacherRecord[]);
        setClasses(classResponse as ClassRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load timetable reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, [canWrite]);

  if (loading) {
    return <DashboardState title="Loading timetable" message="Preparing timetable management tools..." />;
  }

  if (error) {
    return <DashboardState title="Timetable unavailable" message={error} />;
  }

  return (
    <ResourcePage<TimetableRecord>
      title="Timetable"
      description="Manage class schedule entries by day, subject, room, and assigned teacher."
      endpoint="/timetables"
      canWrite={canWrite}
      readOnlyMessage="Students can review the timetable here, but only teachers and administrators can modify it."
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'day',
          label: 'Day',
          render: (item) => getDayLabel(item.dayOfWeek),
        },
        {
          key: 'class',
          label: 'Class',
          render: (item) => `${item.class?.name ?? 'N/A'} ${item.class?.section ?? ''}`.trim(),
        },
        {
          key: 'subject',
          label: 'Subject',
          render: (item) => item.subject ?? 'N/A',
        },
        {
          key: 'time',
          label: 'Time',
          render: (item) => `${item.startTime ?? '--'} - ${item.endTime ?? '--'}`,
        },
        {
          key: 'teacher',
          label: 'Teacher',
          render: (item) => item.teacher?.userId?.name ?? 'Unassigned',
        },
      ]}
      fields={[
        {
          name: 'class',
          label: 'Class',
          type: 'select',
          required: true,
          options: buildOptions(classes, (item) => getEntityId(item), (item) => `${item.name ?? 'Class'} ${item.section ?? ''}`.trim()),
        },
        {
          name: 'teacher',
          label: 'Teacher',
          type: 'select',
          required: true,
          options: buildOptions(teachers, (item) => getEntityId(item), (item) => item.userId?.name ?? 'Unknown teacher'),
        },
        {
          name: 'subject',
          label: 'Subject',
          required: true,
          placeholder: 'Mathematics',
        },
        {
          name: 'dayOfWeek',
          label: 'Day',
          type: 'select',
          required: true,
          options: dayOptions,
        },
        {
          name: 'startTime',
          label: 'Start Time',
          required: true,
          placeholder: '08:00',
        },
        {
          name: 'endTime',
          label: 'End Time',
          required: true,
          placeholder: '09:00',
        },
        {
          name: 'room',
          label: 'Room',
          placeholder: 'Block A - 02',
        },
      ]}
      toFormValues={(item) => ({
        class: getEntityId(item.class),
        teacher: getEntityId(item.teacher),
        subject: item.subject ?? '',
        dayOfWeek: item.dayOfWeek !== undefined ? String(item.dayOfWeek) : '',
        startTime: item.startTime ?? '',
        endTime: item.endTime ?? '',
        room: item.room ?? '',
      })}
      toPayload={(values) => ({
        ...values,
        dayOfWeek: Number(values.dayOfWeek),
      })}
    />
  );
};

export default TimetablePage;

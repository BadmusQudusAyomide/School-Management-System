import React, { useEffect, useState } from 'react';

import ResourcePage from '../../components/management/ResourcePage';
import DashboardState from '../../components/dashboard/DashboardState';
import { referenceDataService } from '../../services/referenceDataService';
import { buildOptions, getEntityId } from '../../utils/management';

interface StudentRecord {
  _id?: string;
  userId?: {
    name?: string;
  };
}

interface ExamRecord {
  _id?: string;
  name?: string;
}

interface GradeRecord {
  _id?: string;
  student?: StudentRecord;
  subject?: string;
  exam?: ExamRecord;
  score?: number;
  grade?: string;
}

const GradesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);

  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      setError('');

      try {
        const [studentResponse, examResponse] = await Promise.all([
          referenceDataService.listStudents(),
          referenceDataService.listExams(),
        ]);

        setStudents(studentResponse as StudentRecord[]);
        setExams(examResponse as ExamRecord[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load grade reference data.');
      } finally {
        setLoading(false);
      }
    };

    void loadReferences();
  }, []);

  if (loading) {
    return <DashboardState title="Loading grades" message="Preparing grade management tools..." />;
  }

  if (error) {
    return <DashboardState title="Grades unavailable" message={error} />;
  }

  return (
    <ResourcePage<GradeRecord>
      title="Grades"
      description="Record assessment scores and manage exam outcomes by student and subject."
      endpoint="/grades"
      getId={(item) => getEntityId(item)}
      columns={[
        {
          key: 'student',
          label: 'Student',
          render: (item) => item.student?.userId?.name ?? 'Unknown student',
        },
        {
          key: 'subject',
          label: 'Subject',
          render: (item) => item.subject ?? 'N/A',
        },
        {
          key: 'exam',
          label: 'Exam',
          render: (item) => item.exam?.name ?? 'N/A',
        },
        {
          key: 'score',
          label: 'Score',
          render: (item) => (item.score !== undefined ? String(item.score) : 'N/A'),
        },
        {
          key: 'grade',
          label: 'Grade',
          render: (item) => item.grade ?? 'N/A',
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
          name: 'subject',
          label: 'Subject',
          required: true,
          placeholder: 'Mathematics',
        },
        {
          name: 'exam',
          label: 'Exam',
          type: 'select',
          required: true,
          options: buildOptions(exams, (item) => getEntityId(item), (item) => item.name ?? 'Untitled exam'),
        },
        {
          name: 'score',
          label: 'Score',
          type: 'number',
          required: true,
          placeholder: '75',
        },
        {
          name: 'grade',
          label: 'Grade',
          required: true,
          placeholder: 'A',
        },
      ]}
      toFormValues={(item) => ({
        student: getEntityId(item.student),
        subject: item.subject ?? '',
        exam: getEntityId(item.exam),
        score: item.score !== undefined ? String(item.score) : '',
        grade: item.grade ?? '',
      })}
      toPayload={(values) => ({
        ...values,
        score: Number(values.score),
      })}
    />
  );
};

export default GradesPage;

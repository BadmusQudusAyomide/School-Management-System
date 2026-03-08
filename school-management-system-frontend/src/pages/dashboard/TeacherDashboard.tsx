import React, { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

const getId = (value: { id?: string; _id?: string } | null | undefined) => value?._id ?? value?.id ?? '';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingGrading: 0, attendanceToMark: 0 });
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [attendanceForm, setAttendanceForm] = useState({ class: '', student: '', date: '', status: 'present' });
  const [gradeForm, setGradeForm] = useState({ student: '', exam: '', subject: '', score: '', grade: '' });

  const classStudents = useMemo(() => {
    const selectedClass = assignedClasses.find((classItem) => getId(classItem) === attendanceForm.class);
    return selectedClass?.students ?? [];
  }, [assignedClasses, attendanceForm.class]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [classesRes, examsRes, timetablesRes] = await Promise.all([
        api.get('/classes'),
        api.get('/exams'),
        api.get('/timetables'),
      ]);

      const classes = (classesRes.data.data ?? []).filter(
        (classItem: { teacher?: { userId?: { _id?: string; id?: string } } }) =>
          getId(classItem.teacher?.userId) === user?.id
      );
      const timetable = (timetablesRes.data.data ?? []).filter(
        (entry: { teacher?: { userId?: { _id?: string; id?: string } } }) =>
          getId(entry.teacher?.userId) === user?.id
      );

      const uniqueStudents = classes.flatMap((classItem: { students?: any[] }) => classItem.students ?? []);
      const studentMap = new Map(uniqueStudents.map((student: any) => [getId(student), student]));
      const scopedStudents = Array.from(studentMap.values());

      setAssignedClasses(classes);
      setTimetableEntries(timetable);
      setStudents(scopedStudents);
      setExams(examsRes.data.data ?? []);
      setStats({
        totalClasses: classes.length,
        totalStudents: scopedStudents.length,
        pendingGrading: examsRes.data.data?.length ?? 0,
        attendanceToMark: classes.length,
      });

      if (classes[0]) {
        setAttendanceForm((current) => ({
          ...current,
          class: getId(classes[0]),
          student: getId(classes[0].students?.[0]),
        }));
      }
      if (scopedStudents[0]) {
        setGradeForm((current) => ({
          ...current,
          student: getId(scopedStudents[0]),
        }));
      }
      if ((examsRes.data.data ?? [])[0]) {
        setGradeForm((current) => ({
          ...current,
          exam: getId(examsRes.data.data[0]),
        }));
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError('Failed to load teacher dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [user?.id]);

  useEffect(() => {
    if (!attendanceForm.class || classStudents.length === 0) {
      return;
    }
    setAttendanceForm((current) => ({
      ...current,
      student: getId(classStudents[0]),
    }));
  }, [attendanceForm.class, classStudents]);

  const submitAttendance = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('attendance');
    try {
      await api.post('/attendance', attendanceForm);
      await loadDashboard();
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to mark attendance.');
    } finally {
      setSaving('');
    }
  };

  const submitGrade = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('grade');
    try {
      await api.post('/grades', {
        ...gradeForm,
        score: Number(gradeForm.score),
      });
      setGradeForm((current) => ({ ...current, subject: '', score: '', grade: '' }));
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to submit grade.');
    } finally {
      setSaving('');
    }
  };

  if (loading) {
    return <DashboardState title="Loading dashboard" message="Fetching assigned classes, exams, and timetable..." />;
  }

  if (error && !assignedClasses.length && !timetableEntries.length) {
    return <DashboardState title="Dashboard unavailable" message={error} actionLabel="Retry" onAction={() => void loadDashboard()} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-white/70 mt-2">View assigned classes, mark attendance, submit grades, and monitor your timetable.</p>
      </div>

      {error && <DashboardState title="Update warning" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Assigned Classes" value={stats.totalClasses} icon={BookOpen} color="blue" />
        <StatCard title="Students" value={stats.totalStudents} icon={Users} color="green" />
        <StatCard title="Pending Grading" value={stats.pendingGrading} icon={Clock} color="yellow" />
        <StatCard title="Attendance Tasks" value={stats.attendanceToMark} icon={CheckCircle} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Assigned Classes</h3>
          <div className="space-y-3">
            {assignedClasses.length ? assignedClasses.map((classItem) => (
              <div key={getId(classItem)} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-medium">{classItem.name} - {classItem.section}</p>
                <p className="text-white/60 text-sm mt-1">{classItem.students?.length ?? 0} students</p>
              </div>
            )) : <p className="text-white/70">No assigned classes found.</p>}
          </div>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Timetable</h3>
          <div className="space-y-3">
            {timetableEntries.length ? timetableEntries.map((entry) => (
              <div key={getId(entry)} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-medium">{entry.subject}</p>
                <p className="text-white/60 text-sm mt-1">
                  Day {entry.dayOfWeek} • {entry.startTime} - {entry.endTime} • {entry.room || 'Room pending'}
                </p>
              </div>
            )) : <p className="text-white/70">No timetable entries found.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Mark Attendance</h3>
          <form className="space-y-4" onSubmit={submitAttendance}>
            <select className="input-glassmorphism w-full" value={attendanceForm.class} onChange={(event) => setAttendanceForm((current) => ({ ...current, class: event.target.value }))}>
              <option value="">Select class</option>
              {assignedClasses.map((classItem) => <option key={getId(classItem)} value={getId(classItem)} className="bg-gray-900">{classItem.name} - {classItem.section}</option>)}
            </select>
            <select className="input-glassmorphism w-full" value={attendanceForm.student} onChange={(event) => setAttendanceForm((current) => ({ ...current, student: event.target.value }))}>
              <option value="">Select student</option>
              {classStudents.map((student: any) => <option key={getId(student)} value={getId(student)} className="bg-gray-900">{student.userId?.name ?? 'Student'}</option>)}
            </select>
            <input type="date" className="input-glassmorphism w-full" value={attendanceForm.date} onChange={(event) => setAttendanceForm((current) => ({ ...current, date: event.target.value }))} required />
            <select className="input-glassmorphism w-full" value={attendanceForm.status} onChange={(event) => setAttendanceForm((current) => ({ ...current, status: event.target.value }))}>
              {['present', 'absent', 'late', 'excused'].map((status) => <option key={status} value={status} className="bg-gray-900">{status}</option>)}
            </select>
            <button type="submit" disabled={saving === 'attendance'} className="btn-primary px-4 py-2 rounded-lg">
              {saving === 'attendance' ? 'Saving...' : 'Mark Attendance'}
            </button>
          </form>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Submit Grades</h3>
          <form className="space-y-4" onSubmit={submitGrade}>
            <select className="input-glassmorphism w-full" value={gradeForm.student} onChange={(event) => setGradeForm((current) => ({ ...current, student: event.target.value }))}>
              <option value="">Select student</option>
              {students.map((student: any) => <option key={getId(student)} value={getId(student)} className="bg-gray-900">{student.userId?.name ?? 'Student'}</option>)}
            </select>
            <select className="input-glassmorphism w-full" value={gradeForm.exam} onChange={(event) => setGradeForm((current) => ({ ...current, exam: event.target.value }))}>
              <option value="">Select exam</option>
              {exams.map((exam: any) => <option key={getId(exam)} value={getId(exam)} className="bg-gray-900">{exam.name}</option>)}
            </select>
            <input className="input-glassmorphism w-full" placeholder="Subject" value={gradeForm.subject} onChange={(event) => setGradeForm((current) => ({ ...current, subject: event.target.value }))} required />
            <input type="number" min="0" max="100" className="input-glassmorphism w-full" placeholder="Score" value={gradeForm.score} onChange={(event) => setGradeForm((current) => ({ ...current, score: event.target.value }))} required />
            <input className="input-glassmorphism w-full" placeholder="Grade" value={gradeForm.grade} onChange={(event) => setGradeForm((current) => ({ ...current, grade: event.target.value }))} required />
            <button type="submit" disabled={saving === 'grade'} className="btn-primary px-4 py-2 rounded-lg">
              {saving === 'grade' ? 'Saving...' : 'Submit Grade'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

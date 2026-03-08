interface AttendanceEntry {
  status?: string;
}

interface FeeEntry {
  dueDate?: string;
  paid?: number;
}

interface StudentEntry {
  createdAt?: string;
}

export const analyticsService = {
  buildAttendanceBreakdown(attendance: AttendanceEntry[]) {
    return ['present', 'absent', 'late', 'excused'].map((status) => ({
      name: status,
      value: attendance.filter((entry) => entry.status === status).length,
    }));
  },

  buildRevenueSeries(fees: FeeEntry[]) {
    const groupedRevenue = new Map<string, number>();

    fees.forEach((fee) => {
      const date = fee.dueDate ? new Date(fee.dueDate) : new Date();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      groupedRevenue.set(month, (groupedRevenue.get(month) ?? 0) + (fee.paid ?? 0));
    });

    return Array.from(groupedRevenue.entries()).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  },

  buildStudentGrowthSeries(students: StudentEntry[]) {
    const groupedGrowth = new Map<string, { label: string; count: number }>();

    students.forEach((student) => {
      const date = student.createdAt ? new Date(student.createdAt) : new Date();
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const current = groupedGrowth.get(key);

      groupedGrowth.set(key, {
        label,
        count: (current?.count ?? 0) + 1,
      });
    });

    let runningTotal = 0;

    return Array.from(groupedGrowth.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => {
        runningTotal += value.count;
        return {
          name: value.label,
          students: runningTotal,
        };
      });
  },
};

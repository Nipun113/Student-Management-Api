import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    const courseWithStudents = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!courseWithStudents) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const students = courseWithStudents.enrollments.map((e) => e.student);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course students' }, { status: 500 });
  }
}
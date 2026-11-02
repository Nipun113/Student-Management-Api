import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'studentId and courseId are required' }, { status: 400 });
    }

    // Check existing enrollment rule
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: Number(studentId),
          courseId: Number(courseId),
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Student is already enrolled in this course' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        courseId: Number(courseId),
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to enroll student' }, { status: 500 });
  }
}
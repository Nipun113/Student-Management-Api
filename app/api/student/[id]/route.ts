import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Student kenekge visthara Get
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { enrollments: { include: { course: true } } },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

// PUT: Student kenekge details update kirima
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);
    const body = await req.json();
    const { name, email, phone } = body;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { name, email, phone },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE: Delete Student
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
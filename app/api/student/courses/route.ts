import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseName, description } = body;

    if (!courseName) {
      return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { courseName, description },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
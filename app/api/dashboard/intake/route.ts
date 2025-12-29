import { prisma } from '@/lib/db';

export async function GET() {
  const data = await prisma.intake.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(data);
}

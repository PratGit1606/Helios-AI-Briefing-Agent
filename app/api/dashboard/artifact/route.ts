import { prisma } from '@/lib/db';

export async function GET() {
  const data = await prisma.artifact.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(data);
}

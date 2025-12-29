import { prisma } from '@/lib/db';

export async function GET() {
  const data = await prisma.changeRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(data);
}

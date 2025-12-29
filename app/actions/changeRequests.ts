// app/actions/changeRequests.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logger, Timer } from "@/lib/debug";

export interface CreateChangeRequestInput {
  projectId: string;
  briefId: string;
  requester: string;
  sections: string[];
  feedback: string;
  priority?: "low" | "normal" | "high" | "critical";
}

export interface ReviewChangeRequestInput {
  requestId: string;
  status: "approved" | "rejected";
  reviewedBy: string;
  resolution?: string;
}

export async function createChangeRequest(input: CreateChangeRequestInput) {
  const timer = new Timer("createChangeRequest");
  const {
    projectId,
    briefId,
    requester,
    sections,
    feedback,
    priority = "normal",
  } = input;

  try {
    if (!requester.trim() || !feedback.trim() || sections.length === 0) {
      return {
        success: false,
        error: "Requester, feedback, and at least one section are required",
      };
    }

    const brief = await prisma.brief.findUnique({
      where: { id: briefId },
    });

    if (!brief) {
      return {
        success: false,
        error: "Brief not found",
      };
    }

    if (brief.isApproved) {
      return {
        success: false,
        error: "Cannot request changes to an approved brief",
      };
    }

    logger.info("createChangeRequest", "Creating change request", {
      projectId,
      sections: sections.length,
    });

    const changeRequest = await prisma.changeRequest.create({
      data: {
        projectId,
        briefId,
        requester,
        sections,
        feedback,
        priority,
        status: "pending",
      },
    });

    await prisma.changeLog.create({
      data: {
        projectId,
        action: "Change request submitted",
        user: requester,
        metadata: {
          requestId: changeRequest.id,
          sections,
          priority,
        },
      },
    });

    timer.end();
    logger.info("createChangeRequest", "Change request created", {
      requestId: changeRequest.id,
    });

    revalidatePath(`/brief/${projectId}`);

    return {
      success: true,
      data: changeRequest,
    };
  } catch (error) {
    timer.end("Failed");
    console.error("RAW Prisma error:", error);
    logger.error("createChangeRequest", "Error creating change request", {
      projectId,
      error,
    });
    console.error("Error creating change request:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create change request",
    };
  }
}

export async function getChangeRequests(projectId: string) {
  const timer = new Timer("getChangeRequests");

  try {
    const changeRequests = await prisma.changeRequest.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    timer.end();
    logger.info("getChangeRequests", "Retrieved change requests", {
      projectId,
      count: changeRequests.length,
    });

    return {
      success: true,
      data: changeRequests,
    };
  } catch (error) {
    timer.end("Failed");
    logger.error("getChangeRequests", "Error fetching change requests", {
      projectId,
      error,
    });
    console.error("Error fetching change requests:", error);

    return {
      success: false,
      error: "Failed to fetch change requests",
    };
  }
}

export async function reviewChangeRequest(input: ReviewChangeRequestInput) {
  const timer = new Timer("reviewChangeRequest");
  const { requestId, status, reviewedBy, resolution } = input;

  try {
    if (!reviewedBy.trim()) {
      return {
        success: false,
        error: "Reviewer name is required",
      };
    }

    const changeRequest = await prisma.changeRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        resolution: resolution || null,
      },
    });

    await prisma.changeLog.create({
      data: {
        projectId: changeRequest.projectId,
        action: `Change request ${status}`,
        user: reviewedBy,
        metadata: {
          requestId,
          originalRequester: changeRequest.requester,
        },
      },
    });

    timer.end();
    logger.info("reviewChangeRequest", "Change request reviewed", {
      requestId,
      status,
    });

    revalidatePath(`/brief/${changeRequest.projectId}`);

    return {
      success: true,
      data: changeRequest,
    };
  } catch (error) {
    timer.end("Failed");
    logger.error("reviewChangeRequest", "Error reviewing change request", {
      requestId,
      error,
    });
    console.error("Error reviewing change request:", error);

    return {
      success: false,
      error: "Failed to review change request",
    };
  }
}

/**
 * Mark change request as implemented
 */
export async function markChangeRequestImplemented(
  requestId: string,
  implementedBy: string
) {
  const timer = new Timer("markChangeRequestImplemented");

  try {
    const changeRequest = await prisma.changeRequest.update({
      where: { id: requestId },
      data: {
        status: "implemented",
      },
    });

    await prisma.changeLog.create({
      data: {
        projectId: changeRequest.projectId,
        action: "Change request implemented",
        user: implementedBy,
        metadata: {
          requestId,
        },
      },
    });

    timer.end();
    revalidatePath(`/brief/${changeRequest.projectId}`);

    return {
      success: true,
      data: changeRequest,
    };
  } catch (error) {
    timer.end("Failed");
    logger.error("markChangeRequestImplemented", "Error", { requestId, error });
    console.error("Error marking as implemented:", error);

    return {
      success: false,
      error: "Failed to mark as implemented",
    };
  }
}

/**
 * Delete a change request
 */
export async function deleteChangeRequest(requestId: string) {
  const timer = new Timer("deleteChangeRequest");

  try {
    const changeRequest = await prisma.changeRequest.findUnique({
      where: { id: requestId },
    });

    if (!changeRequest) {
      return {
        success: false,
        error: "Change request not found",
      };
    }

    await prisma.changeRequest.delete({
      where: { id: requestId },
    });

    await prisma.changeLog.create({
      data: {
        projectId: changeRequest.projectId,
        action: "Change request deleted",
        user: "System",
        metadata: {
          requestId,
          requester: changeRequest.requester,
        },
      },
    });

    timer.end();
    revalidatePath(`/brief/${changeRequest.projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    timer.end("Failed");
    logger.error("deleteChangeRequest", "Error deleting change request", {
      requestId,
      error,
    });
    console.error("Error deleting change request:", error);

    return {
      success: false,
      error: "Failed to delete change request",
    };
  }
}

/**
 * Get change request statistics for a project
 */
export async function getChangeRequestStats(projectId: string) {
  try {
    const requests = await prisma.changeRequest.findMany({
      where: { projectId },
    });

    const stats = {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
      implemented: requests.filter((r) => r.status === "implemented").length,
      critical: requests.filter((r) => r.priority === "critical").length,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    logger.error("getChangeRequestStats", "Error", { projectId, error });
    return {
      success: false,
      error: "Failed to get stats",
    };
  }
}

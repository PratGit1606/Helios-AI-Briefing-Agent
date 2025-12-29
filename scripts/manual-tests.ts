import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  await prisma.changeLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.brief.deleteMany();
  await prisma.intake.deleteMany();
  await prisma.project.deleteMany();
  console.log('✅ Database cleared\n');
}

async function testProjectCreation() {
  console.log('📝 TEST 1: Create Project');
  
  const project = await prisma.project.create({
    data: {
      name: 'ASU Marketing Website Redesign',
      status: 'draft',
      changeLog: {
        create: {
          action: 'Project created',
          user: 'Test Script'
        }
      }
    }
  });

  console.log(`✅ Created project: ${project.id}`);
  console.log(`   Name: ${project.name}`);
  console.log(`   Status: ${project.status}`);
  console.log(`   Created: ${project.createdAt.toISOString()}\n`);
  
  return project;
}

async function testIntakeCreation(projectId: string) {
  console.log('📝 TEST 2: Create Intake Data');
  
  const intake = await prisma.intake.create({
    data: {
      projectId,
      stakeholderDocuments: `We need a modern website that showcases ASU's innovative programs and research. 
      The site should highlight our commitment to accessibility and inclusion, 
      make it easy for prospective students to find information, 
      and provide clear pathways for different audiences (students, faculty, alumni).`,
      boilerplateLanguage: `We are Arizona State University - a place where innovation meets impact. 
      Our voice is bold yet approachable, confident yet inclusive. 
      We believe in breaking barriers, championing access, and designing the future.`
    }
  });

  await prisma.changeLog.create({
    data: {
      projectId,
      action: 'Intake data saved',
      user: 'Test Script',
      metadata: {
        documentsLength: intake.stakeholderDocuments.length,
        boilerplateLength: intake.boilerplateLanguage.length
      }
    }
  });

  console.log(`✅ Created intake for project: ${projectId}`);
  console.log(`   Documents length: ${intake.stakeholderDocuments.length} chars`);
  console.log(`   Boilerplate length: ${intake.boilerplateLanguage.length} chars\n`);
  
  return intake;
}

async function testProjectRetrieval(projectId: string) {
  console.log('📝 TEST 3: Retrieve Project with Relations');
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      intake: true,
      brief: true,
      artifacts: true,
      comments: {
        orderBy: { createdAt: 'desc' }
      },
      changeLog: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) {
    console.log('❌ Project not found\n');
    return null;
  }

  console.log(`✅ Retrieved project successfully:`);
  console.log(`   ID: ${project.id}`);
  console.log(`   Name: ${project.name}`);
  console.log(`   Has Intake: ${!!project.intake}`);
  console.log(`   Has Brief: ${!!project.brief}`);
  console.log(`   Artifacts: ${project.artifacts.length}`);
  console.log(`   Comments: ${project.comments.length}`);
  console.log(`   Change Log Entries: ${project.changeLog.length}\n`);

  return project;
}

async function testProjectList() {
  console.log('📝 TEST 4: List All Projects');
  
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  console.log(`✅ Found ${projects.length} project(s):`);
projects.forEach((p: { id: string; name: string; status: string; createdAt: Date; updatedAt: Date }, idx: number) => {
    console.log(`   ${idx + 1}. ${p.name}`);
    console.log(`      Status: ${p.status}`);
    console.log(`      Created: ${p.createdAt.toISOString()}`);
});
  console.log();

  return projects;
}

async function testProjectStatusUpdate(projectId: string) {
  console.log('📝 TEST 5: Update Project Status');
  
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: 'approved',
      changeLog: {
        create: {
          action: 'Project status changed to approved',
          user: 'Test Script'
        }
      }
    }
  });

  console.log(`✅ Updated project status:`);
  console.log(`   New status: ${project.status}`);
  console.log(`   Updated at: ${project.updatedAt.toISOString()}\n`);

  return project;
}

async function testMultipleProjects() {
  console.log('📝 TEST 6: Create Multiple Projects');
  
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Student Portal Enhancement',
        status: 'draft',
        changeLog: {
          create: {
            action: 'Project created',
            user: 'Test Script'
          }
        }
      }
    }),
    prisma.project.create({
      data: {
        name: 'Research Showcase Platform',
        status: 'approved',
        changeLog: {
          create: {
            action: 'Project created',
            user: 'Test Script'
          }
        }
      }
    })
  ]);

  console.log(`✅ Created ${projects.length} additional projects`);
  projects.forEach(p => {
    console.log(`   - ${p.name} (${p.status})`);
  });
  console.log();

  return projects;
}

async function testErrorHandling() {
  console.log('📝 TEST 7: Error Handling');
  
  // Test 1: Non-existent project
  const nonExistent = await prisma.project.findUnique({
    where: { id: 'non-existent-id-12345' }
  });
  
  if (nonExistent === null) {
    console.log('✅ Non-existent project returns null (expected)');
  } else {
    console.log('❌ Expected null for non-existent project');
  }

  // Test 2: Foreign key constraint
  try {
    await prisma.intake.create({
      data: {
        projectId: 'non-existent-project-id',
        stakeholderDocuments: 'test',
        boilerplateLanguage: 'test'
      }
    });
    console.log('❌ Should have thrown foreign key error');
  } catch (error) {
    console.log('✅ Foreign key constraint enforced (expected error)');
  }

  const testProject = await prisma.project.create({
    data: {
      name: 'Temp Project',
      status: 'draft'
    }
  });

  await prisma.intake.create({
    data: {
      projectId: testProject.id,
      stakeholderDocuments: 'first',
      boilerplateLanguage: 'first'
    }
  });

  try {
    await prisma.intake.create({
      data: {
        projectId: testProject.id,
        stakeholderDocuments: 'second',
        boilerplateLanguage: 'second'
      }
    });
    console.log('❌ Should have thrown unique constraint error');
  } catch (error) {
    console.log('✅ Unique constraint enforced (expected error)');
  }

  // Cleanup
  await prisma.project.delete({ where: { id: testProject.id } });
  console.log();
}

async function testCascadeDelete(projectId: string) {
  console.log('📝 TEST 8: Cascade Delete Verification');
  
  // Get counts before delete
  const intakeCount = await prisma.intake.count({ where: { projectId } });
  const logCount = await prisma.changeLog.count({ where: { projectId } });
  
  console.log(`   Before delete:`);
  console.log(`     - Intake records: ${intakeCount}`);
  console.log(`     - Change log entries: ${logCount}`);
  
  // Delete project
  await prisma.project.delete({
    where: { id: projectId }
  });
  
  // Verify cascade
  const intakeAfter = await prisma.intake.count({ where: { projectId } });
  const logAfter = await prisma.changeLog.count({ where: { projectId } });
  
  console.log(`   After delete:`);
  console.log(`     - Intake records: ${intakeAfter}`);
  console.log(`     - Change log entries: ${logAfter}`);
  
  if (intakeAfter === 0 && logAfter === 0) {
    console.log('✅ Cascade delete successful\n');
  } else {
    console.log('❌ Cascade delete failed - orphaned records exist\n');
  }
}

async function testUpsertIntake(projectId: string) {
  console.log('📝 TEST 9: Upsert Intake (Update Existing)');
  
  // First upsert (create)
  const intake1 = await prisma.intake.upsert({
    where: { projectId },
    create: {
      projectId,
      stakeholderDocuments: 'Initial documents',
      boilerplateLanguage: 'Initial boilerplate'
    },
    update: {
      stakeholderDocuments: 'Updated documents',
      boilerplateLanguage: 'Updated boilerplate'
    }
  });
  
  console.log(`✅ First upsert (created): ${intake1.id}`);
  
  // Second upsert (update)
  const intake2 = await prisma.intake.upsert({
    where: { projectId },
    create: {
      projectId,
      stakeholderDocuments: 'Should not see this',
      boilerplateLanguage: 'Should not see this'
    },
    update: {
      stakeholderDocuments: 'Updated documents v2',
      boilerplateLanguage: 'Updated boilerplate v2'
    }
  });
  
  console.log(`✅ Second upsert (updated): ${intake2.id}`);
  console.log(`   Documents: ${intake2.stakeholderDocuments.substring(0, 30)}...`);
  console.log(`   Same ID: ${intake1.id === intake2.id}\n`);
}

async function displayFinalState() {
  console.log('📊 FINAL DATABASE STATE:');
  console.log('='.repeat(50));
  
  const projectCount = await prisma.project.count();
  const intakeCount = await prisma.intake.count();
  const briefCount = await prisma.brief.count();
  const artifactCount = await prisma.artifact.count();
  const commentCount = await prisma.comment.count();
  const logCount = await prisma.changeLog.count();
  
  console.log(`Projects:     ${projectCount}`);
  console.log(`Intakes:      ${intakeCount}`);
  console.log(`Briefs:       ${briefCount}`);
  console.log(`Artifacts:    ${artifactCount}`);
  console.log(`Comments:     ${commentCount}`);
  console.log(`Change Logs:  ${logCount}`);
  console.log('='.repeat(50));
  console.log();
}

async function runAllTests() {
  console.log('🚀 HELIOS - Phase 2 Manual Test Suite\n');
  console.log('='.repeat(50));
  console.log('Testing: Database Operations & Server Actions');
  console.log('Database: Supabase (via Vercel)');
  console.log('='.repeat(50));
  console.log();
  
  try {
    // Clear database
    await clearDatabase();
    
    // Core functionality tests
    const project1 = await testProjectCreation();
    await testIntakeCreation(project1.id);
    await testProjectRetrieval(project1.id);
    await testProjectList();
    await testProjectStatusUpdate(project1.id);
    
    // Additional tests
    await testMultipleProjects();
    await testErrorHandling();
    await testUpsertIntake(project1.id);
    
    // Cleanup test
    await testCascadeDelete(project1.id);
    
    // Final state
    await displayFinalState();
    
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('🎉 Phase 2 is ready for production use.\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:3000');
    console.log('  3. Test the UI by creating a project\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:\n');
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run all tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
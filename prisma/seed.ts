import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Note: In a real setup, you would need actual user IDs from Supabase
  // This is just an example structure
  const sampleBuyers = [
    {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      city: 'Chandigarh',
      propertyType: 'apartment',
      budgetMin: 50,
      budgetMax: 80,
      timeline: 'ZERO_3M',
      source: 'Website',
      status: 'New',
      notes: 'Looking for 2-3 BHK apartment in good locality',
      tags: ['hot-lead', 'first-time-buyer'],
      createdBy: 'sample-user-id-1', // Replace with actual Supabase user ID
    },
    {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91-9876543211',
      city: 'Mohali',
      propertyType: 'villa',
      budgetMin: 100,
      budgetMax: 150,
      timeline: 'THREE_6M',
      source: 'Referral',
      status: 'Qualified',
      notes: 'Interested in premium villas with modern amenities',
      tags: ['vip-client', 'high-budget'],
      createdBy: 'sample-user-id-1', // Replace with actual Supabase user ID
    },
    {
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91-9876543212',
      city: 'Panchkula',
      propertyType: 'plot',
      budgetMin: 30,
      budgetMax: 50,
      timeline: 'GT_6M',
      source: 'Walk_in',
      status: 'Contacted',
      notes: 'Looking for residential plot for future construction',
      tags: ['investor', 'flexible-timeline'],
      createdBy: 'sample-user-id-1', // Replace with actual Supabase user ID
    },
  ];

  console.log('📊 Seeding sample buyers...');
  
  // Note: This will fail without proper user IDs
  // Uncomment and update with real Supabase user IDs when ready
  /*
  for (const buyer of sampleBuyers) {
    const created = await prisma.buyer.create({
      data: buyer,
    });
    console.log(`✅ Created buyer: ${created.fullName}`);
  }
  */

  console.log('🎉 Database seed completed!');
  console.log('📝 Note: Update the user IDs in this script with actual Supabase user IDs before running.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

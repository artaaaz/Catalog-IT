import { PrismaClient, ServiceStatus, Role, UserStatus } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CATEGORIES_DATA = [
  {
    name: 'Business',
    slug: 'business',
    description: 'Applications and IT services supporting enterprise business operations, portal communications, and corporate management at Nusantara Regas.',
    icon: 'Briefcase',
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Financial planning, accounting, budgeting, travel settlement, and enterprise ERP systems.',
    icon: 'CircleDollarSign',
  },
  {
    name: 'HR',
    slug: 'hr',
    description: 'Human resources, worker profiles, competency, learning hours, mobile attendance, and employee self-service portals.',
    icon: 'Users',
  },
  {
    name: 'Procurement',
    slug: 'procurement',
    description: 'Supply chain management, vendor management systems, warehouse inventory, and procurement portals.',
    icon: 'Package',
  },
  {
    name: 'Operations',
    slug: 'operations',
    description: 'Gas distribution, FSRU/ORF maintenance, asset management, quality standards, and technical engineering tools.',
    icon: 'Cog',
  },
  {
    name: 'HSSE',
    slug: 'hsse',
    description: 'Health, Safety, Security, and Environment tracking, observation cards, and daily health check systems.',
    icon: 'ShieldCheck',
  },
  {
    name: 'Risk Management',
    slug: 'risk-management',
    description: 'Corporate risk registry, risk mitigation tracking, and compliance governance systems.',
    icon: 'AlertTriangle',
  },
  {
    name: 'IT Support',
    slug: 'it-support',
    description: 'Internal IT service desk, ticket fulfillment, room booking, and digital office infrastructure.',
    icon: 'Headphones',
  },
];

// Mapping helper for exact service categorization based on domain/function
function getCategorySlugForService(name: string, owner: string | null, desc: string | null): string {
  const n = (name || '').toLowerCase();
  const o = (owner || '').toLowerCase();
  const d = (desc || '').toLowerCase();

  // 1. Exact System Names & Operations
  if (n.includes('syimmin') || n.includes('activo') || n.includes('semar') || n.includes('sipgas') || n.includes('bassnet') || n.includes('gas management') || n.includes('stk') || n.includes('aman') || o.includes('quality') || o.includes('operation')) {
    return 'operations';
  }
  // 2. Risk & Governance
  if (n.includes('risk') || n.includes('compols') || n.includes('erms')) {
    return 'risk-management';
  }
  // 3. HSSE
  if (n.includes('noc') || n.includes('dcu') || n.includes('daily check') || n.includes('atm') || n.includes('phorse') || n.includes('timbangan') || o.includes('hsse')) {
    return 'hsse';
  }
  // 4. Procurement
  if (n.includes('procurement') || n.includes('vendor') || n.includes('sinv') || n.includes('ipro') || o.includes('procurement')) {
    return 'procurement';
  }
  // 5. IT Support
  if (n.includes('ruang rapat') || n.includes('smart it') || n.includes('meetingroom')) {
    return 'it-support';
  }
  // 6. Finance
  if (n.includes('sap') || n.includes('anaplan') || n.includes('dtm') || n.includes('travel') || d.includes('keuangan')) {
    return 'finance';
  }
  // 7. HR
  if (n.includes('i-am') || n.includes('smart learning') || n.includes('myssc') || n.includes('p-mobile') || n.includes('komet') || d.includes('sdm') || d.includes('pekerja')) {
    return 'hr';
  }
  
  // Default to business
  return 'business';
}

function parseStatus(rawStatus: string | null | undefined): ServiceStatus {
  if (!rawStatus) return ServiceStatus.ACTIVE;
  const s = rawStatus.trim().toUpperCase();
  if (s === 'OK') return ServiceStatus.ACTIVE;
  if (s === '?') return ServiceStatus.UNDER_REVIEW;
  if (s === 'X') return ServiceStatus.INACTIVE;
  return ServiceStatus.ACTIVE;
}

function parseUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const u = rawUrl.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u;
  }
  return null;
}

async function main() {
  console.log('--- START SEEDING NR IT CATALOG ---');

  // 0. Seed Users (ADMIN and USER roles with idempotent upsert)
  console.log('0. Seeding Authentication Users...');
  const salt = await bcrypt.genSalt(10);
  const demoPassword = await bcrypt.hash('NRcatalog123!', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nusantararegas.com' },
    update: {
      name: 'Administrator NR',
      password: demoPassword,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
    },
    create: {
      name: 'Administrator NR',
      email: 'admin@nusantararegas.com',
      password: demoPassword,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
    },
  });
  console.log(`Seeded User: [${adminUser.name}] <${adminUser.email}> (Role: ${adminUser.role}, Status: ${adminUser.status})`);

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@nusantararegas.com' },
    update: {
      name: 'Pekerja Nusantara Regas',
      password: demoPassword,
      role: Role.USER,
      status: UserStatus.APPROVED,
    },
    create: {
      name: 'Pekerja Nusantara Regas',
      email: 'user@nusantararegas.com',
      password: demoPassword,
      role: Role.USER,
      status: UserStatus.APPROVED,
    },
  });
  console.log(`Seeded User: [${regularUser.name}] <${regularUser.email}> (Role: ${regularUser.role}, Status: ${regularUser.status})`);

  // 1. Seed Categories
  const categoryMap = new Map<string, string>(); // slug -> id
  for (const cat of CATEGORIES_DATA) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      },
    });
    categoryMap.set(cat.slug, upserted.id);
    console.log(`Upserted Category: [${upserted.name}] (${upserted.slug})`);
  }

  // 2. Read Catal0g Product NR.xlsx
  const excelPath = path.join(process.cwd(), 'Catal0g Product NR.xlsx');
  console.log(`Reading Excel from: ${excelPath}`);
  const wb = XLSX.readFile(excelPath);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  let insertedCount = 0;
  const usedSlugs = new Set<string>();

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawUrl = row[1] ? String(row[1]).trim() : null;
    const rawName = row[2] ? String(row[2]).trim() : null;
    const rawDesc = row[3] ? String(row[3]).trim() : null;
    const rawOwner = row[4] ? String(row[4]).trim() : null;
    const rawDev = row[5] ? String(row[5]).trim() : null;
    const rawServer = row[6] ? String(row[6]).trim() : null;
    const rawKet = row[7] ? String(row[7]).trim() : null;
    const rawStatus = row[8] ? String(row[8]).trim() : null;

    if (!rawName) continue;

    let baseSlug = generateSlug(rawName);
    if (!baseSlug) baseSlug = `service-${i}`;
    let slug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

    const catSlug = getCategorySlugForService(rawName, rawOwner, rawDesc);
    const categoryId = categoryMap.get(catSlug) || categoryMap.get('business')!;
    const status = parseStatus(rawStatus);
    const validUrl = parseUrl(rawUrl);

    // If rawUrl had something descriptive like "Moble Apps", store it in integration notes if integration is empty
    let integration = rawKet;
    if (rawUrl && !validUrl && !integration) {
      integration = `Platform: ${rawUrl}`;
    }

    const service = await prisma.service.upsert({
      where: { slug },
      update: {
        name: rawName,
        categoryId,
        description: rawDesc,
        url: validUrl,
        owner: rawOwner,
        developer: rawDev,
        server: rawServer,
        integration,
        status,
      },
      create: {
        name: rawName,
        slug,
        categoryId,
        description: rawDesc,
        url: validUrl,
        owner: rawOwner,
        developer: rawDev,
        server: rawServer,
        integration,
        status,
      },
    });

    console.log(`[${++insertedCount}/38] Seeded Service: "${service.name}" -> Category: [${catSlug}] Status: [${service.status}]`);
  }

  console.log(`\nSuccessfully seeded ${insertedCount} services into PostgreSQL!`);
  console.log('--- SEEDING COMPLETED ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

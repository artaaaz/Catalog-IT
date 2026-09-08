import React from 'react';
import {
  Briefcase,
  CircleDollarSign,
  Users,
  Package,
  Cog,
  ShieldCheck,
  AlertTriangle,
  Headphones,
  Folder,
  Globe,
  Database,
  Server,
  Layers,
  FileText,
  Activity,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends Omit<LucideProps, 'name'> {
  name?: string | null;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const iconMap: Record<string, React.ElementType> = {
    briefcase: Briefcase,
    business: Briefcase,
    circledollarsign: CircleDollarSign,
    dollar: CircleDollarSign,
    finance: CircleDollarSign,
    users: Users,
    hr: Users,
    package: Package,
    procurement: Package,
    cog: Cog,
    operations: Cog,
    settings: Cog,
    shieldcheck: ShieldCheck,
    shield: ShieldCheck,
    hsse: ShieldCheck,
    alerttriangle: AlertTriangle,
    risk: AlertTriangle,
    'risk-management': AlertTriangle,
    headphones: Headphones,
    'it-support': Headphones,
    support: Headphones,
    globe: Globe,
    database: Database,
    server: Server,
    layers: Layers,
    filetext: FileText,
    activity: Activity,
  };

  const key = (name || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const IconComponent = iconMap[key] || Folder;

  return <IconComponent {...props} />;
}

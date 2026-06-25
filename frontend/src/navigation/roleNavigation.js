import {
  BookOpenText,
  Building2,
  ChartNoAxesColumn,
  Database,
  Gauge,
  History,
  LifeBuoy,
  LayoutGrid,
  Megaphone,
  ScrollText,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";

import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  hasAnyRole
} from "../auth/roles.js";

function linkVisible(user, item) {
  return hasAnyRole(user, item.roles || [ROLE_OPERATOR, ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]);
}

export function buildSidebarSections(t, user) {
  const sections = [
    {
      key: "operations",
      title: t.layout.sections.operations,
      links: [
        {
          to: "/upload",
          label: t.layout.nav.upload,
          mobileLabel: t.layout.nav.uploadShort,
          icon: LayoutGrid,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/dashboard",
          label: t.layout.nav.dashboard,
          mobileLabel: t.layout.nav.dashboard,
          icon: ChartNoAxesColumn,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/records",
          label: t.layout.nav.records,
          mobileLabel: t.layout.nav.recordsShort,
          icon: Database,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/kpi",
          label: t.layout.nav.kpi,
          mobileLabel: t.layout.nav.kpiShort,
          icon: Gauge,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/announcements",
          label: t.layout.nav.announcements,
          mobileLabel: t.layout.nav.announcementsShort,
          icon: Megaphone,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/batches",
          label: t.layout.nav.batches,
          mobileLabel: t.layout.nav.batchesShort,
          icon: History,
          roles: [ROLE_OPERATOR]
        },
        {
          to: "/guide",
          label: t.layout.nav.guide,
          mobileLabel: t.layout.nav.guideShort,
          icon: BookOpenText,
          roles: [ROLE_OPERATOR]
        }
      ]
    },
    {
      key: "data",
      title: t.layout.sections.data,
      links: [
        {
          to: "/dashboard",
          label: t.layout.nav.dashboard,
          mobileLabel: t.layout.nav.dashboard,
          icon: ChartNoAxesColumn,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        },
        {
          to: "/records",
          label: t.layout.nav.records,
          mobileLabel: t.layout.nav.recordsShort,
          icon: Database,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        },
        {
          to: "/kpi",
          label: t.layout.nav.kpi,
          mobileLabel: t.layout.nav.kpiShort,
          icon: Gauge,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        },
        {
          to: "/announcements",
          label: t.layout.nav.announcements,
          mobileLabel: t.layout.nav.announcementsShort,
          icon: Megaphone,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        },
        {
          to: "/batches",
          label: t.layout.nav.batches,
          mobileLabel: t.layout.nav.batchesShort,
          icon: History,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        },
        {
          to: "/guide",
          label: t.layout.nav.guide,
          mobileLabel: t.layout.nav.guideShort,
          icon: BookOpenText,
          roles: [ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN]
        }
      ]
    },
    {
      key: "supervision",
      title: t.layout.sections.supervision,
      links: [
        {
          to: "/operators",
          label: t.layout.nav.operators,
          mobileLabel: t.layout.nav.operatorsShort,
          icon: Users,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_SUPERVISOR]
        }
      ]
    },
    {
      key: "management",
      title: t.layout.sections.management,
      links: [
        {
          to: "/manager",
          label: t.layout.nav.managerWorkspace,
          mobileLabel: t.layout.nav.managerWorkspaceShort,
          icon: Building2,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/operators",
          label: t.layout.nav.operators,
          mobileLabel: t.layout.nav.operatorsShort,
          icon: Users,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_MANAGER]
        }
      ]
    },
    {
      key: "admin",
      title: t.layout.sections.admin,
      links: [
        {
          to: "/admin-panel",
          label: t.layout.nav.adminWorkspace,
          mobileLabel: t.layout.nav.adminWorkspaceShort,
          icon: ShieldCheck,
          roles: [ROLE_ADMIN]
        },
        {
          to: "/operators",
          label: t.layout.nav.operators,
          mobileLabel: t.layout.nav.operatorsShort,
          icon: Users,
          roles: [ROLE_ADMIN]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_ADMIN]
        }
      ]
    }
  ];

  return sections
    .map((section) => ({
      ...section,
      links: section.links.filter((item) => linkVisible(user, item))
    }))
    .filter((section) => section.links.length > 0);
}

export function buildBottomLinks(t) {
  return [
    { to: "/help", label: t.layout.nav.help, mobileLabel: t.layout.nav.helpShort, icon: LifeBuoy },
    { to: "/settings", label: t.layout.nav.settings, mobileLabel: t.layout.nav.settingsShort, icon: Settings }
  ];
}

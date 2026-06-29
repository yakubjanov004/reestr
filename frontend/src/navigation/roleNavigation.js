import {
  Activity,
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
    /* ── Operator: Asosiy (Upload) ──────────────────────────── */
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
        }
      ]
    },

    /* ── Operator: O'z paneli ───────────────────────────────── */
    {
      key: "operator_view",
      title: t.layout.operatorPanel,
      links: [
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

    /* ── Supervisor: Role panel ──────────────────────────────── */
    {
      key: "supervisor_panel",
      title: t.layout.sections.supervisorControl || t.layout.supervisorPanel,
      links: [
        {
          to: "/dashboard",
          label: t.layout.nav.dashboard,
          mobileLabel: t.layout.nav.dashboard,
          icon: ChartNoAxesColumn,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/supervisor-monitoring",
          label: t.layout.nav.monitoring,
          mobileLabel: t.layout.nav.monitoringShort,
          icon: Activity,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/operators",
          label: t.layout.nav.operators,
          mobileLabel: t.layout.nav.operatorsShort,
          icon: Users,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/records",
          label: t.layout.nav.records,
          mobileLabel: t.layout.nav.recordsShort,
          icon: Database,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/batches",
          label: t.layout.nav.batches,
          mobileLabel: t.layout.nav.batchesShort,
          icon: History,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/announcements",
          label: t.layout.nav.announcements,
          mobileLabel: t.layout.nav.announcementsShort,
          icon: Megaphone,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_SUPERVISOR]
        },
        {
          to: "/guide",
          label: t.layout.nav.guide,
          mobileLabel: t.layout.nav.guideShort,
          icon: BookOpenText,
          roles: [ROLE_SUPERVISOR]
        }
      ]
    },

    /* ── Manager: Role panel ─────────────────────────────────── */
    {
      key: "manager_panel",
      title: t.layout.sections.managerControl || t.layout.managerPanel,
      links: [
        {
          to: "/dashboard",
          label: t.layout.nav.dashboard,
          mobileLabel: t.layout.nav.dashboard,
          icon: ChartNoAxesColumn,
          roles: [ROLE_MANAGER]
        },
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
          to: "/supervisor-monitoring",
          label: t.layout.nav.monitoring,
          mobileLabel: t.layout.nav.monitoringShort,
          icon: Activity,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/records",
          label: t.layout.nav.records,
          mobileLabel: t.layout.nav.recordsShort,
          icon: Database,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/batches",
          label: t.layout.nav.batches,
          mobileLabel: t.layout.nav.batchesShort,
          icon: History,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/announcements",
          label: t.layout.nav.announcements,
          mobileLabel: t.layout.nav.announcementsShort,
          icon: Megaphone,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_MANAGER]
        },
        {
          to: "/guide",
          label: t.layout.nav.guide,
          mobileLabel: t.layout.nav.guideShort,
          icon: BookOpenText,
          roles: [ROLE_MANAGER]
        }
      ]
    },

    /* ── Admin: Role panel ───────────────────────────────────── */
    {
      key: "admin_panel",
      title: t.layout.sections.adminControl || t.layout.adminPanel,
      links: [
        {
          to: "/dashboard",
          label: t.layout.nav.dashboard,
          mobileLabel: t.layout.nav.dashboard,
          icon: ChartNoAxesColumn,
          roles: [ROLE_ADMIN]
        },
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
          to: "/announcements",
          label: t.layout.nav.announcements,
          mobileLabel: t.layout.nav.announcementsShort,
          icon: Megaphone,
          roles: [ROLE_ADMIN]
        },
        {
          to: "/supervisor-monitoring",
          label: t.layout.nav.monitoring,
          mobileLabel: t.layout.nav.monitoringShort,
          icon: Activity,
          roles: [ROLE_ADMIN]
        },
        {
          to: "/audit",
          label: t.layout.nav.audit,
          mobileLabel: t.layout.nav.audit,
          icon: ScrollText,
          roles: [ROLE_ADMIN]
        },
        {
          to: "/guide",
          label: t.layout.nav.guide,
          mobileLabel: t.layout.nav.guideShort,
          icon: BookOpenText,
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

export function buildTopLinks(t) {
  return [];
}

export function buildBottomLinks(t) {
  return [
    { to: "/help", label: t.layout.nav.help, mobileLabel: t.layout.nav.helpShort, icon: LifeBuoy },
    { to: "/settings", label: t.layout.nav.settings, mobileLabel: t.layout.nav.settingsShort, icon: Settings }
  ];
}

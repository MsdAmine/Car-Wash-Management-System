// Minimal SVG icon set — strokes, currentColor.
const Icon = ({ d, size = 18, fill, stroke = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "none"}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

const IconCar = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M5 17h14M5 17v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2M19 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
        <path d="M3 17l2.2-6.6A2 2 0 0 1 7.1 9h9.8a2 2 0 0 1 1.9 1.4L21 17" />
        <path d="M3 17h18" />
        <circle cx="7" cy="14" r="1" />
        <circle cx="17" cy="14" r="1" />
      </>
    }
  />
);
const IconSparkles = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
        <circle cx="12" cy="12" r="3" />
      </>
    }
  />
);
const IconCalendar = (p) => (
  <Icon
    {...p}
    d={
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </>
    }
  />
);
const IconWallet = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
        <path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3" />
        <path d="M22 11h-4a2 2 0 1 0 0 4h4z" />
      </>
    }
  />
);
const IconCheck = (p) => <Icon {...p} d={<path d="M4 12l5 5L20 6" />} />;
const IconClock = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    }
  />
);
const IconUser = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </>
    }
  />
);
const IconUsers = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2 20a7 7 0 0 1 14 0" />
        <path d="M17 4a3.5 3.5 0 0 1 0 7" />
        <path d="M22 19a6 6 0 0 0-5-5.9" />
      </>
    }
  />
);
const IconShield = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />
      </>
    }
  />
);
const IconHome = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
      </>
    }
  />
);
const IconChart = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    }
  />
);
const IconList = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </>
    }
  />
);
const IconPlus = (p) => <Icon {...p} d={<path d="M12 5v14M5 12h14" />} />;
const IconSearch = (p) => (
  <Icon {...p} size={p.size || 16} d={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>} />
);
const IconBell = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </>
    }
  />
);
const IconChevR = (p) => <Icon {...p} d={<path d="M9 6l6 6-6 6" />} />;
const IconChevL = (p) => <Icon {...p} d={<path d="M15 6l-6 6 6 6" />} />;
const IconChevD = (p) => <Icon {...p} d={<path d="M6 9l6 6 6-6" />} />;
const IconArrowR = (p) => <Icon {...p} d={<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>} />;
const IconArrowUp = (p) => <Icon {...p} d={<><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></>} />;
const IconArrowDown = (p) => <Icon {...p} d={<><path d="M12 5v14" /><path d="M6 13l6 6 6-6" /></>} />;
const IconX = (p) => <Icon {...p} d={<path d="M6 6l12 12M6 18L18 6" />} />;
const IconFilter = (p) => <Icon {...p} d={<path d="M3 5h18l-7 9v6l-4-2v-4z" />} />;
const IconMail = (p) => (
  <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></>} />
);
const IconPhone = (p) => (
  <Icon
    {...p}
    d={
      <path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5 5L14.5 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-1z" />
    }
  />
);
const IconLock = (p) => (
  <Icon
    {...p}
    d={
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    }
  />
);
const IconEye = (p) => (
  <Icon {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>} />
);
const IconLogout = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
        <path d="M10 17l-5-5 5-5M5 12h11" />
      </>
    }
  />
);
const IconSettings = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    }
  />
);
const IconMenu = (p) => <Icon {...p} d={<path d="M4 7h16M4 12h16M4 17h16" />} />;
const IconMapPin = (p) => (
  <Icon {...p} d={<><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>} />
);
const IconDroplet = (p) => <Icon {...p} d={<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z" />} />;
const IconWrench = (p) => (
  <Icon
    {...p}
    d={
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z" />
    }
  />
);
const IconReceipt = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    }
  />
);
const IconPlay = (p) => <Icon {...p} d={<path d="M6 4l14 8-14 8z" />} fill="currentColor" stroke={0} />;
const IconRefresh = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M21 12a9 9 0 1 1-3.5-7.1" />
        <path d="M21 3v6h-6" />
      </>
    }
  />
);
const IconStar = (p) => (
  <Icon
    {...p}
    d={
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    }
  />
);

Object.assign(window, {
  Icon,
  IconCar,
  IconSparkles,
  IconCalendar,
  IconWallet,
  IconCheck,
  IconClock,
  IconUser,
  IconUsers,
  IconShield,
  IconHome,
  IconChart,
  IconList,
  IconPlus,
  IconSearch,
  IconBell,
  IconChevR,
  IconChevL,
  IconChevD,
  IconArrowR,
  IconArrowUp,
  IconArrowDown,
  IconX,
  IconFilter,
  IconMail,
  IconPhone,
  IconLock,
  IconEye,
  IconLogout,
  IconSettings,
  IconMenu,
  IconMapPin,
  IconDroplet,
  IconWrench,
  IconReceipt,
  IconPlay,
  IconRefresh,
  IconStar,
});

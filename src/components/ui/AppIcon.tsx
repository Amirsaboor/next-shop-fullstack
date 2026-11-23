import type { IconType } from 'react-icons';
import {
  FiActivity, FiArrowLeft, FiBell, FiBox, FiCheckCircle, FiChevronLeft, FiClock,
  FiCpu, FiDownload, FiEdit2, FiFileText, FiGrid, FiHeadphones, FiLayers, FiLink,
  FiLogOut, FiMenu, FiMinusCircle, FiMonitor, FiMoon, FiMoreHorizontal, FiMusic,
  FiPackage, FiPlus, FiSearch, FiSettings, FiSlash, FiSmartphone, FiSun, FiTrendingUp,
  FiTruck, FiUser, FiUsers, FiVolume2, FiWatch, FiX,
} from 'react-icons/fi';

const icons: Record<string, IconType> = {
  activity: FiActivity, arrow: FiArrowLeft, bell: FiBell, box: FiBox,
  cloud: FiCloud, code: FiCode,
  'check-circle': FiCheckCircle, chevron: FiChevronLeft, clock: FiClock, cpu: FiCpu,
  download: FiDownload, edit: FiEdit2, file: FiFileText, grid: FiGrid,
  headphones: FiHeadphones, layers: FiLayers, link: FiLink, logout: FiLogOut,
  menu: FiMenu, 'minus-circle': FiMinusCircle, monitor: FiMonitor, moon: FiMoon,
  more: FiMoreHorizontal, music: FiMusic, package: FiPackage, plus: FiPlus,
  search: FiSearch, settings: FiSettings, slash: FiSlash, smartphone: FiSmartphone,
  sun: FiSun, 'trending-up': FiTrendingUp, truck: FiTruck, user: FiUser,
  users: FiUsers, volume: FiVolume2, watch: FiWatch, close: FiX,
};

type AppIconProps = { name: string; size?: number; className?: string };

export default function AppIcon({ name, size = 18, className }: AppIconProps) {
  const Icon = icons[name] ?? FiPackage;
  return <Icon size={size} className={className} aria-hidden="true" focusable="false" />;
}

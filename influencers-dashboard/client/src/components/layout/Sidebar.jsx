import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart,
  FileText,
  Settings,
  Search,
  Award
} from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';
import translations from '@/lib/translations';
import '@/styles/components/layout/Sidebar.css';

const Sidebar = React.forwardRef(({ className = '', ...props }, ref) => {
  const { language } = useTranslation();

  // Pegue os itens do menu do arquivo de traduções com base no idioma atual
  const menuItems = translations.menuItems[language].map((item, index) => {
    // Adicione ícones e notificações
    const icons = [
      <LayoutDashboard size={18} />,
      <Users size={18} />,
      <AlertTriangle size={18} />,
      <BarChart size={18} />,
      <FileText size={18} />,
      <Settings size={18} />,
      <Search size={18} />,
      <Award size={18} />
    ];

    // Adicione notificações apenas para Influencers e Reports/Relatórios
    const notifications = index === 1 ? 3 : (index === 4 ? 2 : null);

    return {
      ...item,
      icon: icons[index],
      notifications
    };
  });

  return (
    <aside className={`sidebar ${className}`} ref={ref} {...props}>
      <nav className="sidebar-nav">
        <div className="menu-items">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-text">{item.name}</span>
              {item.notifications && (
                <span className="notification-badge">{item.notifications}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
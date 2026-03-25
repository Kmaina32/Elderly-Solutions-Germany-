import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, ShoppingBag, ShieldAlert, LogOut, PhoneCall, Menu, X, CheckCircle, LayoutGrid, Activity, Calendar, Heart, ShieldCheck, ChevronDown, HelpCircle, LifeBuoy, ClipboardList } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../utils/cn';
import { HelpModal } from './HelpModal';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Type } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

export function Layout({ children, userRole }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const { fontSize, setFontSize } = useAccessibility();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const bottomNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Social', path: '/social', icon: Users },
    { label: 'Services', path: '/services', icon: ShoppingBag },
    { label: 'AI', path: '/empathy-lab', icon: Heart },
  ];

  if (userRole === 'caregiver') {
    bottomNavItems[2] = { label: 'Care Plan', path: '/services', icon: ClipboardList };
  } else if (userRole === 'professional') {
    bottomNavItems[1] = { label: 'Patients', path: '/social', icon: Users };
    bottomNavItems[2] = { label: 'Alerts', path: '/services', icon: ShieldAlert };
  }

  const menuItems = [
    { label: 'Knowledge Hub', path: '/knowledge', icon: HelpCircle, desc: 'Learn' },
    { label: 'Profile', path: '/profile', icon: CheckCircle, desc: 'Account' },
  ];

  if (userRole === 'admin') {
    menuItems.push({ label: 'Administration', path: '/admin', icon: ShieldAlert, desc: 'Admin' });
  }

  const BrandName = ({ isMobile = false }) => (
    <button 
      onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
      className="flex flex-col group text-left"
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "font-serif font-bold tracking-tight text-slate-primary leading-none",
          isMobile ? "text-xl" : "text-2xl"
        )}>
          Elderly solutions
        </span>
        <ChevronDown 
          size={isMobile ? 14 : 16} 
          className={cn("text-stone-400 transition-transform", isSolutionsOpen && "rotate-180")} 
        />
      </div>
      <span className={cn(
        "font-sans font-bold uppercase tracking-[0.3em] text-stone-400",
        isMobile ? "text-[10px] mt-1" : "text-xs mt-2"
      )}>
        Dignified Care
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-linen-bg text-charcoal font-sans flex flex-col lg:flex-row selection:bg-sage-accent/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-stone-200 sticky top-0 h-screen z-50">
        <div className="p-8 border-b border-stone-100">
          <BrandName />
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">Main Navigation</p>
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                location.pathname === item.path 
                  ? "bg-slate-primary text-white shadow-lg shadow-slate-primary/20" 
                  : "text-stone-500 hover:bg-stone-50 hover:text-slate-primary"
              )}
            >
              <item.icon size={20} className={cn("transition-transform group-hover:scale-110", location.pathname === item.path ? "text-white" : "text-stone-400")} />
              <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}

          <div className="my-8 pt-8 border-t border-stone-100">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">More Options</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  location.pathname === item.path 
                    ? "bg-slate-primary text-white shadow-lg shadow-slate-primary/20" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-slate-primary"
                )}
              >
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", location.pathname === item.path ? "text-white" : "text-stone-400")} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  <span className="text-[9px] opacity-60 uppercase tracking-tighter">{item.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-stone-100 space-y-4">
          <button 
            onClick={() => setIsAccessibilityOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-slate-primary transition-all"
          >
            <Type size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-terracotta hover:bg-terracotta/5 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Progress Bar */}
        <motion.div
          key={location.pathname}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed top-0 left-0 lg:left-72 right-0 h-[2px] bg-sage-accent z-[60]"
        />

        {/* Editorial Header (Mobile Only) */}
        <header className="lg:hidden bg-white border-b border-stone-200 px-8 py-6 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            <BrandName isMobile />
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-slate-primary hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </header>

        {/* Desktop Header (Simplified, only for Care Ecosystem) */}
        <header className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-stone-100 px-12 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
              className={cn(
                'text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sage-accent py-2 flex items-center gap-2',
                isSolutionsOpen ? 'text-slate-primary' : 'text-stone-400'
              )}
            >
              Care Ecosystem <ChevronDown size={12} className={cn("transition-transform", isSolutionsOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isSolutionsOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSolutionsOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-12 mt-4 w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100 p-6 z-50 overflow-hidden"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-serif font-bold text-slate-primary">Care Ecosystem</h3>
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Integrated Solutions</p>
                        </div>
                        <button onClick={() => setIsSolutionsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-stone-400 hover:text-slate-primary transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Health Monitoring', desc: 'Vital signs & alerts', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                          { label: 'Social Events', desc: 'Community gatherings', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                          { label: 'Care Services', desc: 'Professional assistance', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                          { label: 'Safety Alerts', desc: 'Emergency response', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
                          { label: 'Community Hub', desc: 'Connect with peers', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                          { label: 'Marketplace', desc: 'Essential supplies', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((sol) => (
                          <button
                            key={sol.label}
                            className="flex items-start gap-3 p-3 rounded-2xl border border-transparent hover:border-stone-100 hover:bg-stone-50 transition-all group text-left"
                          >
                            <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm", sol.bg, sol.color)}>
                              <sol.icon size={20} />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-primary block">{sol.label}</span>
                              <span className="text-[9px] text-stone-400 font-medium uppercase tracking-wider">{sol.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
              <BrandName isMobile />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-primary"
              >
                <X size={32} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8">
              <div className="grid grid-cols-2 gap-3">
                {/* Care Ecosystem Items */}
                {[
                  { label: 'Health', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Events', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Safety', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Market', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((sol, i) => (
                  <motion.button
                    key={sol.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 border border-stone-100 gap-2 active:scale-95 transition-transform"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", sol.bg, sol.color)}>
                      <sol.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-primary">{sol.label}</span>
                  </motion.button>
                ))}

                {/* Menu Nav Items */}
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 h-full gap-2',
                        location.pathname === item.path 
                          ? 'bg-sage-accent/10 border-sage-accent text-sage-accent' 
                          : 'bg-white border-stone-100 text-slate-primary'
                      )}
                    >
                      <item.icon size={20} />
                      <div className="text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider block">{item.label}</span>
                        <span className="text-[8px] opacity-60 uppercase tracking-tighter">{item.desc}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-8 border-t border-stone-100 grid grid-cols-2 gap-4"
              >
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAccessibilityOpen(true);
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 text-slate-primary"
                >
                  <Type size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 rounded-xl bg-terracotta/5 text-terracotta"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </button>
              </motion.div>
            </nav>

            <div className="p-12 bg-linen-bg/30">
              <p className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">
                Need Immediate Help?
              </p>
              <Button 
                variant="danger" 
                size="lg" 
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHelpOpen(true);
                }}
              >
                Assistance Center
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-8 pt-16 pb-32 lg:pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Navigation Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-stone-200 px-6 py-3 lg:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-90",
                location.pathname === item.path 
                  ? "text-slate-primary bg-stone-100" 
                  : "text-stone-400 hover:text-slate-primary"
              )}
            >
              <item.icon size={22} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-90",
              isMenuOpen ? "text-slate-primary bg-stone-100" : "text-stone-400 hover:text-slate-primary"
            )}
          >
            <LayoutGrid size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
          </button>
        </div>
      </div>

      {/* Floating Assistance Button (FAB) */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-terracotta text-white rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-95 transition-transform hover:bg-terracotta/90"
        aria-label="Get Assistance"
      >
        <LifeBuoy size={28} className="animate-pulse" />
      </button>

      {/* Editorial Footer */}
      <footer className="hidden lg:block bg-slate-primary text-linen-bg/60 py-20 px-12 border-t border-stone-200 ml-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-tight text-linen-bg">
                Elderly solutions
              </span>
              <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-linen-bg/40 mt-1">
                Dignified Care
              </span>
            </div>
            <p className="text-base leading-relaxed max-w-xs">
              Dedicated to providing dignified, professional care and fostering meaningful connections for our elderly community.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-linen-bg font-serif text-lg font-bold">Resources</h4>
            <nav className="flex flex-col gap-4">
              <a href="#" className="hover:text-linen-bg transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="hover:text-linen-bg transition-colors text-sm">Terms of Service</a>
              <a href="#" className="hover:text-linen-bg transition-colors text-sm">Accessibility Statement</a>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="text-linen-bg font-serif text-lg font-bold">Contact</h4>
            <p className="text-base">support@elderlysolutions.com</p>
            <p className="text-base">1-800-ELDERLY</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-linen-bg/10 text-center text-xs uppercase tracking-[0.2em] text-linen-bg/30">
          © 2026 Elderly solutions Healthcare Technology Studio
        </div>
      </footer>

      {/* Accessibility Menu Overlay */}
      <AnimatePresence>
        {isAccessibilityOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccessibilityOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-24 lg:left-auto lg:right-8 lg:translate-x-0 lg:translate-y-0 w-[calc(100%-2rem)] max-w-sm lg:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-8 z-[70]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-slate-primary">Accessibility</h3>
                  <button onClick={() => setIsAccessibilityOpen(false)} className="text-stone-400 hover:text-slate-primary">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm font-sans font-bold uppercase tracking-widest text-stone-400">Font Size Scaling</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'sm', label: 'Small', size: 'text-sm' },
                      { id: 'base', label: 'Normal', size: 'text-base' },
                      { id: 'lg', label: 'Large', size: 'text-lg' },
                      { id: 'xl', label: 'Extra Large', size: 'text-xl' },
                      { id: '2xl', label: 'Maximum', size: 'text-2xl' },
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setFontSize(size.id as any)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                          fontSize === size.id 
                            ? "border-sage-accent bg-sage-accent/5 text-slate-primary" 
                            : "border-stone-100 text-stone-500 hover:border-stone-200"
                        )}
                      >
                        <span className={cn("font-medium", size.size)}>{size.label}</span>
                        {fontSize === size.id && <CheckCircle size={20} className="text-sage-accent" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="text-xs text-stone-400 italic leading-relaxed">
                  Adjusting the font size will scale all text across the Elderly solutions platform for better readability.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </div>
  );
}

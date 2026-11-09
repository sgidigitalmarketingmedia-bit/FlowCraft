import React, { useState } from 'react';
import { X, Plus, Smartphone, Sparkles, Layout, Shield, ShoppingCart, User, Layers } from 'lucide-react';
import { Screen } from '../../types/builder';

interface AddScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScreen: (screen: Omit<Screen, 'id' | 'x' | 'y'>) => void;
  existingScreensCount: number;
}

export const AddScreenModal: React.FC<AddScreenModalProps> = ({
  isOpen,
  onClose,
  onAddScreen,
  existingScreensCount,
}) => {
  const [title, setTitle] = useState(`0${existingScreensCount + 1}. New Screen`);
  const [route, setRoute] = useState(`/flow/screen-${existingScreensCount + 1}`);
  const [template, setTemplate] = useState<'blank' | 'checkout' | 'profile' | 'form'>('blank');
  const [bgColor, setBgColor] = useState('#0F172A');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let elements: any[] = [];
    if (template === 'checkout') {
      elements = [
        {
          id: `el_${Date.now()}_hdr`,
          type: 'header',
          name: 'Checkout Header',
          label: 'Order Checkout',
          helperText: 'Review items and delivery',
          hasAction: true,
          trigger: 'onClick',
          actionType: 'back',
        },
        {
          id: `el_${Date.now()}_card`,
          type: 'card',
          name: 'Delivery Address Card',
          label: 'Priority Express Delivery',
          helperText: '742 Evergreen Terrace, San Francisco, CA',
          variant: 'primary',
          icon: 'truck',
        },
        {
          id: `el_${Date.now()}_metric`,
          type: 'metric',
          name: 'Total Amount',
          label: 'Order Total (Tax Included)',
          metricValue: '$189.50',
          metricChange: 'Free Shipping applied',
        },
        {
          id: `el_${Date.now()}_btn`,
          type: 'button',
          name: 'Pay Button',
          label: 'Authorize Apple Pay',
          variant: 'primary',
          hasAction: true,
          trigger: 'onClick',
          actionType: 'toast',
          toastMessage: 'Payment authorized successfully!',
        },
      ];
    } else if (template === 'profile') {
      elements = [
        {
          id: `el_${Date.now()}_hdr`,
          type: 'header',
          name: 'Profile Header',
          label: 'Account & Vault',
          helperText: 'Personal security and preferences',
        },
        {
          id: `el_${Date.now()}_item1`,
          type: 'list_item',
          name: 'Personal Details',
          label: 'Identity & KYC Verification',
          helperText: 'Tier 3 Enterprise Verified',
          metricValue: 'Verified',
        },
        {
          id: `el_${Date.now()}_item2`,
          type: 'list_item',
          name: 'Two Factor Auth',
          label: 'Multi-Factor Hardware Key',
          helperText: 'YubiKey 5C NFC paired',
          metricValue: 'Enabled',
        },
        {
          id: `el_${Date.now()}_toggle`,
          type: 'toggle',
          name: 'Push Notification Alerts',
          label: 'Real-Time Transaction Alerts',
          helperText: 'Instant notification on any card activity',
          toggleChecked: true,
        },
      ];
    } else if (template === 'form') {
      elements = [
        {
          id: `el_${Date.now()}_hdr`,
          type: 'header',
          name: 'Form Header',
          label: 'Feedback & Request',
          helperText: 'Send message to product team',
        },
        {
          id: `el_${Date.now()}_inp1`,
          type: 'input',
          name: 'Subject Input',
          label: 'Inquiry Subject',
          placeholder: 'e.g. Feature request for mobile widgets',
          inputType: 'text',
        },
        {
          id: `el_${Date.now()}_inp2`,
          type: 'input',
          name: 'Details Input',
          label: 'Message Details',
          placeholder: 'Explain the details of your request...',
          inputType: 'text',
        },
        {
          id: `el_${Date.now()}_btn`,
          type: 'button',
          name: 'Submit Button',
          label: 'Submit Feedback',
          variant: 'primary',
          hasAction: true,
          trigger: 'onClick',
          actionType: 'toast',
          toastMessage: 'Feedback submitted to team.',
        },
      ];
    }

    onAddScreen({
      title,
      route,
      width: 360,
      height: 720,
      backgroundColor: bgColor,
      statusBarColor: 'light',
      isEntry: false,
      elements,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-bold text-white tracking-tight">Add New Artboard Screen</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Screen Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Route Path</label>
            <input
              type="text"
              required
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Screen Template</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'blank', label: 'Blank Screen', desc: 'Empty canvas artboard' },
                { id: 'checkout', label: 'Checkout / Pay', desc: 'Order review & pay CTA' },
                { id: 'profile', label: 'User Profile', desc: 'Settings & account toggles' },
                { id: 'form', label: 'Data Input Form', desc: 'Inputs & submit action' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id as any)}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    template === t.id
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
              />
              <span className="font-mono text-slate-400">{bgColor}</span>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Create Artboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};



import { useState } from "react";
import { MapPin, ShieldCheck, Lock, LogOut, Phone, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  // Toggle states for notification preferences
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [reminderAlerts, setReminderAlerts] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Form input states
  const [fullName, setFullName] = useState("Adebayo Ogunlesi");

  return (
    <div className="bg-[#FAF7F0] min-h-screen py-10 px-4 md:px-8">
      
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">My Profile</h1>
        <p className="text-stone-500 text-sm mt-1">
          Keep your details up to date so hub managers can reach you quickly and we can match you with the right storage for every harvest.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: User Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-100 text-center space-y-6">
          
          {/* Avatar & Details */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-100 shadow-inner">
              <img src="/avatar-adebayo.jpg" alt="Adebayo Ogunlesi" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Adebayo Ogunlesi</h2>
              <p className="text-xs text-stone-500">bayoo82@gmail.com</p>
              <p className="text-xs text-stone-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-[#1B4D3E]" /> Ibadan, Oyo State
              </p>
            </div>
            <div className="bg-emerald-50 text-[#1B4D3E] px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Member since January 2026
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl">
            <div className="text-center">
              <span className="block text-lg font-bold text-stone-800">12</span>
              <span className="text-[10px] text-stone-400 font-medium">Bookings</span>
            </div>
            <div className="text-center border-x border-stone-200">
              <span className="block text-lg font-bold text-stone-800">4</span>
              <span className="text-[10px] text-stone-400 font-medium">Hubs used</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-stone-800">86t</span>
              <span className="text-[10px] text-stone-400 font-medium">Stored</span>
            </div>
          </div>

          {/* View My Bookings Button */}
          <button className="w-full border-2 border-[#D9822B] hover:bg-orange-50 text-stone-900 py-3 rounded-full text-xs font-bold transition-colors">
            View My Bookings
          </button>

        </div>

        {/* Right Column: Information, Preferences & Security */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Personal Information Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
              <p className="text-xs text-stone-500">Used for booking confirmations and hub manager contact.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">Email Address <span className="text-stone-400 text-[10px]">(email can't be changed in this demo)</span></label>
                  <input 
                    type="email" 
                    disabled 
                    value="bayoo82@gmail.com" 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">Phone Number <span className="text-stone-400 text-[10px]">(number can't be changed in this demo)</span></label>
                  <input 
                    type="text" 
                    disabled 
                    value="+234700000000" 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="bg-[#D9822B] hover:bg-[#c47323] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* 2. Notification Preferences Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
              <p className="text-xs text-stone-500">Choose how AgroKeep keeps you informed.</p>
            </div>

            <div className="divide-y divide-stone-100 space-y-4">
              
              {/* Toggle 1 */}
              <div className="flex justify-between items-center pt-3">
                <div>
                  <p className="text-xs font-bold text-stone-800">Booking Updates</p>
                  <p className="text-[11px] text-stone-400">Confirmations, changes and hub messages</p>
                </div>
                <button 
                  onClick={() => setBookingUpdates(!bookingUpdates)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${bookingUpdates ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${bookingUpdates ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">Payment Notifications</p>
                  <p className="text-[11px] text-stone-400">Deposits, balances and receipts</p>
                </div>
                <button 
                  onClick={() => setPaymentNotifications(!paymentNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${paymentNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${paymentNotifications ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">Reminder Alerts</p>
                  <p className="text-[11px] text-stone-400">Drop-off and collection reminders</p>
                </div>
                <button 
                  onClick={() => setReminderAlerts(!reminderAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${reminderAlerts ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${reminderAlerts ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Toggle 4 */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">SMS Notifications</p>
                  <p className="text-[11px] text-stone-400">Works without data</p>
                </div>
                <button 
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${smsNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${smsNotifications ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Toggle 5 */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">Email Notifications</p>
                  <p className="text-[11px] text-stone-400">Detailed summaries and receipts</p>
                </div>
                <button 
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button className="bg-[#D9822B] hover:bg-[#c47323] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors">
                Save Preferences
              </button>
            </div>
          </div>

          {/* 3. Account Security Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Account Security</h3>
              <p className="text-xs text-stone-500">Keep your account protected.</p>
            </div>

            <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Password</p>
                  <p className="text-[11px] text-stone-400">Last changed 3 months ago</p>
                </div>
              </div>
              <button className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Log Out & Save All Actions */}
          <div className="flex justify-between items-center pt-2">
            <button className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 px-2">
              <LogOut className="h-4 w-4" /> Log out
            </button>
            <button className="bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3 rounded-full text-xs font-bold shadow-sm transition-colors">
              Save All Changes
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Assistance Banner */}
      <div className="max-w-7xl mx-auto mt-16 bg-[#1B4D3E] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Need assistance?</h3>
            <p className="text-stone-200 text-xs md:text-sm mt-1">Our support team is available 7 days a week.</p>
          </div>
        </div>
        <button className="bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-md transition-colors flex items-center gap-2">
          Contact Support <Phone className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
}

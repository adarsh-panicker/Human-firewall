import React from 'react';
import { 
  Mail, 
  QrCode, 
  PhoneCall, 
  HardDrive, 
  Wifi, 
  AlertOctagon, 
  Info
} from 'lucide-react';
import { Scenario } from '../types/game';

interface SimulatedMessageProps {
  scenario: Scenario;
}

export const SimulatedMessage: React.FC<SimulatedMessageProps> = ({ scenario }) => {
  const { simulatedType, simulatedData } = scenario;

  switch (simulatedType) {
    // ----------------------------------------------------
    // MFA PUSH NOTIFICATION SIMULATOR
    // ----------------------------------------------------
    case 'mfa':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-5 shadow-xl max-w-xl mx-auto">
          {/* Simulated Mobile Push Banner */}
          <div className="bg-navy-900 border border-cyan-500/30 rounded-xl p-4 mb-4 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  {simulatedData.appName || 'SecureAuth Mobile'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">{simulatedData.time || 'Just now'}</span>
            </div>

            <div className="text-left space-y-1.5">
              <p className="text-sm font-semibold text-white">
                {simulatedData.service || 'Apex Cloud Workspace Sign-in'}
              </p>
              <p className="text-xs font-mono text-cyan-300">
                Account: {simulatedData.account}
              </p>
              <div className="bg-navy-950/90 p-2.5 rounded-lg border border-navy-800 text-xs text-amber-300/90 font-mono flex items-center gap-2 mt-2">
                <span className="text-base">📍</span>
                <span>{simulatedData.location}</span>
              </div>
            </div>
          </div>

          {/* Concurrent Chat Message */}
          {simulatedData.chatMessage && (
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-3.5 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                  {simulatedData.chatAvatar || 'IT'}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {simulatedData.chatSender}
                </span>
                <span className="text-[10px] text-slate-400">Direct Message</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic pl-7 border-l-2 border-indigo-500/40">
                "{simulatedData.chatMessage}"
              </p>
            </div>
          )}
        </div>
      );

    // ----------------------------------------------------
    // EMAIL CLIENT SIMULATOR (BEC / Invoices / Phishing)
    // ----------------------------------------------------
    case 'email':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl overflow-hidden shadow-xl max-w-2xl mx-auto text-left">
          {/* Email Header Bar */}
          <div className="bg-navy-900 px-4 py-3 border-b border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Corporate Webmail Client</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{simulatedData.date}</span>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            {/* Headers */}
            <div className="space-y-1.5 text-xs pb-3 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16 shrink-0">From:</span>
                <span className="text-white font-medium">{simulatedData.senderName}</span>
                <span className="text-cyan-300 font-mono text-[11px] bg-navy-900 px-1.5 py-0.5 rounded border border-navy-800">
                  &lt;{simulatedData.senderEmail}&gt;
                </span>
              </div>

              {simulatedData.replyTo && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16 shrink-0">Reply-To:</span>
                  <span className="text-rose-300 font-mono text-[11px] bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/60">
                    &lt;{simulatedData.replyTo}&gt;
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16 shrink-0">Subject:</span>
                <span className="text-white font-semibold">{simulatedData.subject}</span>
              </div>

              {simulatedData.highlightWarning && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md mt-2">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{simulatedData.highlightWarning}</span>
                </div>
              )}
            </div>

            {/* Email Body */}
            <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans py-2">
              {simulatedData.emailBody}
            </div>

            {/* Attachment preview if present */}
            {simulatedData.attachment && (
              <div className="pt-2 border-t border-navy-800">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-900 border border-navy-700 text-xs text-slate-200">
                  <span className="text-red-400 font-bold text-[10px] uppercase bg-red-950/80 px-1 py-0.5 rounded border border-red-800">PDF</span>
                  <span className="font-mono">{simulatedData.attachment}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    // ----------------------------------------------------
    // QR CODE PHISHING SIMULATOR (Quishing)
    // ----------------------------------------------------
    case 'qr':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-5 shadow-xl max-w-lg mx-auto text-left">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-navy-800">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">Smartphone Camera Viewfinder</span>
          </div>

          <div className="relative bg-navy-900 border-2 border-dashed border-cyan-500/40 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-4">
            {/* Viewfinder Target corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            <div className="w-24 h-24 bg-white p-2 rounded-lg mb-3 shadow-md flex items-center justify-center">
              {/* Synthetic stylized QR matrix */}
              <div className="w-full h-full border-4 border-black p-1 grid grid-cols-4 gap-1">
                <div className="bg-black col-span-2 row-span-2" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black col-span-2" />
                <div className="bg-black" />
              </div>
            </div>

            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {simulatedData.posterHeadline}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {simulatedData.qrImageText}
            </p>
          </div>

          {/* Decoded URL Preview Bar */}
          <div className="bg-navy-900 p-3 rounded-xl border border-navy-700">
            <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">
              Decoded Web Destination:
            </div>
            <div className="text-xs font-mono text-cyan-300 break-all bg-navy-950 p-2 rounded border border-navy-800">
              {simulatedData.decodedUrl}
            </div>
            {simulatedData.warningLabel && (
              <div className="mt-2 text-[11px] text-amber-400 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{simulatedData.warningLabel}</span>
              </div>
            )}
          </div>
        </div>
      );

    // ----------------------------------------------------
    // INCOMING PHONE CALL SIMULATOR (Vishing)
    // ----------------------------------------------------
    case 'call':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-5 shadow-xl max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <PhoneCall className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full mb-1">
            Call Connected • {simulatedData.duration || '00:24'}
          </span>
          <h3 className="text-base font-bold text-white">
            {simulatedData.callerId}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {simulatedData.callerName || simulatedData.callerNumber}
          </p>

          {/* Active incoming SMS banner if code was sent */}
          {simulatedData.smsReceived && (
            <div className="bg-navy-900 border border-amber-500/40 rounded-xl p-3 text-left">
              <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1">
                <span>Incoming SMS Passcode</span>
                <span>Just Now</span>
              </div>
              <p className="text-xs font-mono text-slate-200 bg-navy-950 p-2 rounded border border-navy-800">
                {simulatedData.smsReceived}
              </p>
            </div>
          )}
        </div>
      );

    // ----------------------------------------------------
    // SUSPICIOUS USB DRIVE SIMULATOR
    // ----------------------------------------------------
    case 'usb':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-6 shadow-xl max-w-md mx-auto text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <HardDrive className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">Physical Discovery</span>
              <h3 className="text-sm font-bold text-white">Unattended Removable Media</h3>
            </div>
          </div>

          <div className="bg-navy-900 rounded-xl p-4 border border-navy-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Handwritten Label:</span>
              <span className="text-amber-300 font-mono font-bold">{simulatedData.usbLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reported Hardware:</span>
              <span className="text-slate-200">{simulatedData.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location Found:</span>
              <span className="text-slate-300">{simulatedData.locationFound}</span>
            </div>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // PUBLIC WI-FI SELECTOR SIMULATOR
    // ----------------------------------------------------
    case 'wifi':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-5 shadow-xl max-w-lg mx-auto text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Device Network Settings</span>
            </div>
            <span className="text-[11px] text-slate-400">Wi-Fi Active</span>
          </div>

          <div className="space-y-2 mb-4">
            {simulatedData.networks?.map((net: any, idx: number) => (
              <div key={idx} className="bg-navy-900 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{net.ssid}</div>
                  <div className={`text-[10px] ${net.security.includes('Open') ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {net.security}
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{net.signal}</span>
              </div>
            ))}
          </div>

          {simulatedData.captivePortalWarning && (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{simulatedData.captivePortalWarning}</span>
            </div>
          )}
        </div>
      );

    // ----------------------------------------------------
    // BROWSER CERTIFICATE WARNING SIMULATOR
    // ----------------------------------------------------
    case 'browser':
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl overflow-hidden shadow-xl max-w-2xl mx-auto text-left">
          {/* Simulated Browser URL bar */}
          <div className="bg-navy-900 px-4 py-2.5 border-b border-navy-800 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 bg-navy-950 px-3 py-1 rounded-lg text-xs font-mono text-rose-300 flex items-center justify-between border border-rose-500/30">
              <span className="truncate">{simulatedData.browserUrl || simulatedData.urlAttempted}</span>
              <span className="text-[10px] uppercase text-rose-400 font-bold shrink-0 ml-2">Not Secure</span>
            </div>
          </div>

          {/* Browser Warning Body */}
          <div className="p-6 bg-gradient-to-b from-rose-950/20 to-navy-950 space-y-4">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-8 h-8 text-rose-500 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Your connection is not private</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {simulatedData.browserPrompt || 'Attackers might be trying to steal your information (for example, passwords, messages, or credit cards).'}
                </p>
                <div className="mt-3 text-xs font-mono text-slate-400 bg-navy-900/80 p-2.5 rounded border border-navy-800">
                  Error Code: {simulatedData.warningType || 'NET::ERR_CERT_COMMON_NAME_INVALID'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // CHAT / SMS / JOB OFFER SIMULATOR
    // ----------------------------------------------------
    case 'chat':
    case 'job':
    case 'sms':
    default:
      return (
        <div className="bg-navy-950/90 border border-navy-800 rounded-2xl p-5 shadow-xl max-w-xl mx-auto text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                {simulatedData.chatSender ? simulatedData.chatSender.slice(0, 2).toUpperCase() : 'VIP'}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  {simulatedData.chatSender || simulatedData.recruiter || simulatedData.sender}
                </div>
                <div className="text-[10px] text-slate-400">
                  {simulatedData.senderPhone || simulatedData.role || 'Direct Message'}
                </div>
              </div>
            </div>
            {simulatedData.urgency && (
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                {simulatedData.urgency}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed">
              {simulatedData.chatMessage || simulatedData.message || simulatedData.requestDetails}
            </div>

            {simulatedData.salary && (
              <div className="flex justify-between items-center bg-navy-900 p-2.5 rounded-lg border border-navy-800 text-xs font-mono">
                <span className="text-slate-400">Offered Compensation:</span>
                <span className="text-emerald-400 font-bold">{simulatedData.salary}</span>
              </div>
            )}
          </div>
        </div>
      );
  }
};

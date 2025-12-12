import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/UI/ToastContext';
import { Smartphone, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import clsx from 'clsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestOTP, verifyOTP } = useAuth();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || "/";

  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); 
  
  // Data
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);

  // Handle Countdown
  React.useEffect(() => {
    let interval;
    if (timer > 0) {
        interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOTP = async (e) => {
    e?.preventDefault();
    if (formData.phone.length < 10) {
        addToast("Please enter a valid phone number.", "error");
        return;
    }
    
    setLoading(true);
    try {
        const otp = await requestOTP(formData.phone);
        setGeneratedOtp(otp);
        alert(`Your Mock OTP is: ${otp}`); 
        
        setStep('OTP');
        setTimer(30); 
        addToast(`OTP Sent to ${formData.phone}`, "success");
    } catch (err) {
        addToast("Failed to request OTP", "error");
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (verifyOTP(otpInput, generatedOtp, formData)) {
        addToast("Verified successfully! Logging in...", "success");
        navigate(from, { replace: true });
    } else {
        addToast("Invalid OTP. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 text-center border-b border-slate-700">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-900/40">
                <ShieldCheck size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-100">ClimateHub Login</h1>
            <p className="text-sm text-slate-400">Verify your identity to contribute</p>
        </div>

        <div className="p-8">
            {step === 'PHONE' ? (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="tel"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center justify-center gap-2",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? "Sending..." : <>Get OTP <ArrowRight size={18} /></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Enter the 6-digit code sent to</p>
                        <p className="font-mono text-emerald-400 font-bold">{formData.phone}</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative w-2/3">
                            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="number"
                                autoFocus
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-center tracking-[0.5em] font-mono text-lg"
                                placeholder="000000"
                                value={otpInput}
                                onChange={e => setOtpInput(e.target.value.slice(0, 6))}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition shadow-lg shadow-emerald-900/20",
                            loading && "opacity-50"
                        )}
                    >
                        {loading ? "Verifying..." : "Verify & Login"}
                    </button>

                    <div className="flex flex-col gap-2">
                        <button 
                            type="button"
                            disabled={timer > 0 || loading}
                            onClick={() => handleRequestOTP()}
                            className={clsx(
                                "w-full text-sm font-medium",
                                timer > 0 ? "text-slate-600" : "text-emerald-500 hover:text-emerald-400"
                            )}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>

                        <button 
                            type="button"
                            onClick={() => setStep('PHONE')}
                            className="w-full text-slate-500 text-sm hover:text-slate-300"
                        >
                            Change Phone Number
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}

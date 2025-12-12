import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/UI/ToastContext';
import { Smartphone, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import clsx from 'clsx';
import LightRays from '../components/ui/LightRays';

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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
             <LightRays
                raysOrigin="center"
                raysColor="#10b981"
                raysSpeed={0.5}
                lightSpread={1.0}
                className="opacity-20"
             />
        </div>

      <div className="w-full max-w-md bg-[#050505]/60 backdrop-blur-xl border border-emerald-500/10 rounded-3xl shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)] overflow-hidden relative z-10">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="bg-[#0a0a0a]/50 p-8 text-center border-b border-[#222]">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
            <p className="text-sm text-gray-400 mt-2 font-light">Verify your identity to access ClimateHub</p>
        </div>

        <div className="p-8">
            {step === 'PHONE' ? (
                <form onSubmit={handleRequestOTP} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] rounded-xl text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative group">
                            <Smartphone className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                type="tel"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] rounded-xl text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
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
                            "w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_5px_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_5px_25px_-5px_rgba(16,185,129,0.6)] active:scale-[0.98]",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? "Sending Code..." : <>Get OTP <ArrowRight size={18} /></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">Enter the verification code sent to</p>
                        <p className="font-mono text-emerald-400 font-bold tracking-wide bg-emerald-500/10 py-1 px-3 rounded-lg inline-block">{formData.phone}</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative w-3/4 group">
                            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input 
                                type="number"
                                autoFocus
                                required
                                className="w-full pl-12 pr-4 py-4 bg-[#111] border border-[#222] rounded-xl text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center tracking-[0.8em] font-mono text-xl shadow-inner"
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
                            "w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_5px_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_5px_25px_-5px_rgba(16,185,129,0.6)] active:scale-[0.98]",
                            loading && "opacity-50"
                        )}
                    >
                        {loading ? "Verifying..." : "Confirm & Login"}
                    </button>

                    <div className="flex flex-col gap-3">
                        <button 
                            type="button"
                            disabled={timer > 0 || loading}
                            onClick={() => handleRequestOTP()}
                            className={clsx(
                                "w-full text-xs font-bold uppercase tracking-wider",
                                timer > 0 ? "text-gray-600" : "text-emerald-500 hover:text-emerald-400"
                            )}
                        >
                            {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
                        </button>

                        <button 
                            type="button"
                            onClick={() => setStep('PHONE')}
                            className="w-full text-gray-500 text-xs hover:text-gray-300 transition-colors"
                        >
                            Use a different number
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}

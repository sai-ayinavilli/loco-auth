import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/auth';

function VerifyOTPPage({ userEmail, userName, setIsAuthenticated }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyOTP(userEmail, otp);
      
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setResending(true);
    setResendMessage('');
    setError('');
    
    try {
      const result = await resendOTP(userEmail);
      
      if (result.success) {
        setResendMessage('OTP sent successfully! Check your email.');
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setResending(false);
    }
  };
  
  return (
    <div className="container">
      <div className="form-container">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit code to {userEmail}. Enter it below to verify your account.</p>
        
        {error && <div className="error-message">{error}</div>}
        {resendMessage && <div className="success-message">{resendMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              pattern="\d{6}"
              placeholder="Enter 6-digit code"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div className="form-footer">
          <button 
            className="link-button" 
            onClick={handleResendOTP} 
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPPage;
import { useEffect, useRef, useState, useCallback } from 'react';
import { proctorAPI } from '../api';
import './WebcamProctor.css';

export default function WebcamProctor({ examId, onViolation, active = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('initializing');
  const [faces, setFaces] = useState([]);
  const [alert, setAlert] = useState('');
  const [flags, setFlags] = useState([]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; }
      setStatus('active');
    } catch (err) {
      setStatus('error');
      setAlert('Camera access denied. Please enable your webcam.');
    }
  }, []);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !active) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.5);
    try {
      const res = await proctorAPI.analyzeFrame({ image: base64, exam_id: examId });
      const data = res.data;
      setFaces(data.faces || []);
      setFlags(data.flags || []);
      if (data.flags && data.flags.length > 0) {
        setStatus('warning');
        const msg = data.flags.includes('no_face') ? 'No face detected!' : data.flags.includes('multiple_faces') ? 'Multiple faces detected!' : 'Position your face in center';
        setAlert(msg);
        onViolation?.(data);
        setTimeout(() => { setAlert(''); setStatus('active'); }, 3000);
      } else {
        setStatus('active');
      }
    } catch (err) { /* silent fail on frame analysis */ }
  }, [examId, active, onViolation]);

  useEffect(() => {
    if (active) startCamera();
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, [active, startCamera]);

  useEffect(() => {
    if (!active || status === 'error') return;
    const interval = setInterval(captureFrame, 3000);
    return () => clearInterval(interval);
  }, [active, status, captureFrame]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && active) {
        proctorAPI.logEvent({ exam_id: examId, event_type: 'tab_switch', details: 'Student switched tabs' });
        onViolation?.({ flags: ['tab_switch'], details: 'Tab switch detected' });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [examId, active, onViolation]);

  return (
    <div className="webcam-proctor">
      <video ref={videoRef} className="webcam-video" autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="webcam-overlay">
        {faces.map((f, i) => (
          <div key={i} className={`webcam-face-box ${flags.length > 0 ? 'warning' : ''}`}
            style={{ left: f.x, top: f.y, width: f.w, height: f.h }} />
        ))}
      </div>
      <div className="webcam-status">
        <div className={`webcam-status-dot ${status}`} />
        {status === 'active' ? 'AI Monitoring Active' : status === 'warning' ? 'Warning Detected' : status === 'error' ? 'Camera Error' : 'Initializing...'}
      </div>
      {alert && <div className="webcam-alert">{alert}</div>}
    </div>
  );
}

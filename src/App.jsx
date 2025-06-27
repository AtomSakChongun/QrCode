import React, { useState, useRef } from 'react';
import { QrCode, Link, Download, Copy, Check, Heart, Sparkles } from 'lucide-react';

const App = () => {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const generateQRCode = async () => {
    if (!url.trim()) return;
    
    setIsGenerating(true);
    
    // สร้าง QR code ด้วย API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=000000&bgcolor=ffffff`;
    setQrCodeUrl(qrApiUrl);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full shadow-lg">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-pink-400 ml-2 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              QR Code Generator
            </h1>
            <p className="text-gray-600 text-lg">สร้าง QR Code น่ารักๆ จากลิงค์ของคุณ</p>
            <div className="flex items-center justify-center mt-2">
              <Heart className="w-4 h-4 text-pink-400 mr-1" />
              <span className="text-sm text-gray-500">ง่าย สวย รวดเร็ว</span>
              <Heart className="w-4 h-4 text-pink-400 ml-1" />
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Link className="w-4 h-4 mr-2 text-indigo-500" />
                  ใส่ลิงค์ที่ต้องการสร้าง QR Code
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    {url && (
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-indigo-500 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={generateQRCode}
                disabled={!url.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังสร้าง...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>สร้าง QR Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 animate-fadeIn">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-500 mr-2" />
                  QR Code ของคุณพร้อมแล้ว!
                  <Sparkles className="w-6 h-6 text-pink-500 ml-2" />
                </h3>
                
                <div className="bg-white rounded-3xl p-8 shadow-inner mb-6 inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="w-64 h-64 mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">ลิงค์ที่สร้าง:</p>
                  <p className="text-indigo-600 font-medium break-all">{url}</p>
                </div>

                <button
                  onClick={downloadQRCode}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-8 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลด QR Code</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p className="flex items-center justify-center">
              Made with <Heart className="w-4 h-4 text-pink-500 mx-1" /> for everyone
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
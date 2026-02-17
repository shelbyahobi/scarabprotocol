import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
                    <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 max-w-lg text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-6">
                            The application encountered an unexpected error. This is likely a temporary connectivity issue.
                        </p>

                        {/* Debugging: Show error in production for now */}
                        {this.state.error && (
                            <div className="bg-black/50 p-4 rounded-lg text-left text-xs text-red-300 font-mono mb-6 overflow-auto max-h-40">
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-beetle-gold/20 hover:bg-beetle-gold/30 text-beetle-gold border border-beetle-gold/50 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                            >
                                <RefreshCw size={18} /> Reload Application
                            </button>

                            {/* If it's a wallet error, offer to disconnect/clear cache (simulated by ignoring for now as we can't easily clear wagmi state from here without complex logic) */}
                            {(this.state.error?.toString().includes('MetaMask') || this.state.error?.toString().includes('Connector')) && (
                                <button
                                    onClick={() => {
                                        localStorage.clear(); // Nuclear option to clear persistent bad states
                                        window.location.reload();
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-lg font-bold transition-all"
                                >
                                    Reset Wallet Cache
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

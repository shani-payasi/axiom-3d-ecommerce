import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Last line of defence. If anything throws, the user still gets a working page
 * and a clear message instead of an empty black screen.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AXIOM] unrecoverable error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950 px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-300/80">Render fault</p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white">This scene hit a snag</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-white/50">
            Your GPU or browser blocked part of the 3D experience. Reloading usually restores it — the store itself is
            unaffected.
          </p>
          <p className="mt-4 rounded-xl border border-white/[0.07] bg-black/40 px-3 py-2 text-left text-[10px] text-white/35">
            {this.state.error.message}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-gradient-to-br from-cyan-200 to-sky-400 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-950"
            >
              Reload experience
            </button>
            <Link
              to="/"
              className="rounded-full border border-white/15 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

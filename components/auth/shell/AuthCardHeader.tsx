'use client';

export default function AuthCardHeader() {
  return (
    <div className="authHeader">
      <div className="authTitleRow">
        <div className="authTitle">QUICK PORTAL</div>
        <div className="authBadges" aria-hidden="true">
          <div className="badge"><span className="dot" />NEW</div>
          <div className="badge dark"><span className="dot" />STATUS OK</div>
        </div>
      </div>
      <div className="authSub">TRAINING · TASKS · PROGRESS · REPORTS</div>
    </div>
  );
}

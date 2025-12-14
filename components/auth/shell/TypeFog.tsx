'use client';

export default function TypeFog() {
  return (
    <div className="typeFog" aria-hidden="true">
      <div className="tfCol left">
        <div className="tfBlock">
          <div className="tfBig">QUICK</div>
          <div className="tfBig">PLATFORM</div>
          <div className="tfBig">TRAINING</div>
        </div>

        <div className="tfBlock">
          <div className="tfMid">TASK QUEUE</div>
          <div className="tfMid">REVIEW LOOP</div>
          <div className="tfMid">REPORTS</div>
        </div>

        <div className="tfBlock">
          <div className="tfTiny">SECURE ACCESS · STATUS OK</div>
          <div className="tfTiny">PATCH v0.1 · BUILD LIVE</div>
        </div>
      </div>

      <div className="tfCol right">
        <div className="tfBlock">
          <div className="tfBig">STUDENTS</div>
          <div className="tfBig">AGENCIES</div>
          <div className="tfBig">CREATORS</div>
        </div>

        <div className="tfBlock">
          <div className="tfMid">COHORTS</div>
          <div className="tfMid">ALERTS</div>
          <div className="tfMid">BILLING</div>
        </div>

        <div className="tfBlock">
          <div className="tfTiny">SYNC · EXPORT · AUDIT LOG</div>
          <div className="tfTiny">AUTO TASKS · PROGRESS</div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import ProgramView from "./ProgramView";
import "./styles/JobProgram.css";

function JobProgram() {
  return (
    <div className="main-content">
      <div className="container mt-4">
        {/* ✅ 컨테이너 틀 추가 */}
        <div className="program-wrapper">
          <div className="program-header">
            <h2 className="program-title">전체 프로그램</h2>
            <hr className="program-divider" />
          </div>

          {/* ✅ ProgramView 포함 */}
          <ProgramView />
        </div>
      </div>
    </div>
  );
}

export default JobProgram;
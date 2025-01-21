import React from "react";
import ProgramView from "./ProgramView";
import "./styles/JobProgram.css";

function JobProgram() {
  return (
    <div className="main-content">
      <div className="container mt-4">
        <h2>전체 프로그램</h2>
        <hr />
        {/* ProgramView 포함 */}
        <ProgramView />
      </div>
      {/* Footer는 ProgramView 아래에 위치 */}
      <footer>
        <div className="text-center p-3">© 2025 대학일자리플러스</div>
      </footer>
    </div>
  );
}

export default JobProgram;
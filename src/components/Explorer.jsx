import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DRIVES, otherDrive, drivePath } from "../os/filesystem.jsx";

/* ============================================================
   Explorer — the file-manager window each drive mounts into.

   Route shape:  /dev            → directory listing of C:\DEV\
                 /dev/about.txt  → about.txt opened
                 /leadership     → directory listing of D:\LEADER\
   ============================================================ */

function FileListing({ drive }) {
  return (
    <>
      <p className="nb-dir-header">
        {">"} ls -la {drive.route} &nbsp;&nbsp;({drive.children.length} items)
      </p>

      <div className="nb-file-list" role="list">
        <div className="nb-file-row nb-file-row-head" aria-hidden="true">
          <span />
          <span>Name</span>
          <span>Type</span>
          <span>Size</span>
        </div>

        {drive.children.map((node) => (
          <Link
            key={node.id}
            to={`${drive.route}/${node.id}`}
            className="nb-file-row"
            role="listitem"
          >
            <span className="nb-file-icon" aria-hidden="true">{node.icon}</span>
            <span className="nb-file-name">
              {node.kind === "dir" ? `${node.id}\\` : node.id}
            </span>
            <span className="nb-file-type">{node.type}</span>
            <span className="nb-file-size">{node.size}</span>
          </Link>
        ))}
      </div>

      <p className="nb-file-hint">// click a file to open it</p>
    </>
  );
}

function NodeNotFound({ drive, nodeId }) {
  return (
    <div className="nb-file-404">
      <p className="nb-dir-header">{">"} cat {nodeId}</p>
      <h2>404 — FILE NOT FOUND</h2>
      <p>No file named "{nodeId}" on {drive.letter}:\</p>
      <Link to={drive.route} className="nb-btn nb-btn-yellow">
        ◀ BACK TO {drive.letter}:\{drive.label}\
      </Link>
    </div>
  );
}

function Explorer({ driveKey }) {
  const navigate = useNavigate();
  const { nodeId } = useParams();

  const drive = DRIVES[driveKey];
  const other = otherDrive(driveKey);
  const node = nodeId ? drive.children.find((c) => c.id === nodeId) : null;
  const atRoot = !nodeId;

  // ↑ UP: file → drive root → desktop (like "My Computer")
  const goUp = () => navigate(atRoot ? "/" : drive.route);

  return (
    <div className="nb-explorer-screen">
      <div
        className="nb-window nb-explorer"
        style={{ "--window-accent": `var(${drive.accentVar})`, "--drive-text": drive.accentText }}
      >
        {/* Title bar */}
        <div className="nb-window-bar">
          <span className={`nb-window-title${drive.accentText === "var(--white)" ? " inv" : ""}`}>
            {drivePath(drive, nodeId)}
          </span>
          <div className="nb-window-controls">
            <span className="nb-control" aria-hidden="true">−</span>
            <span className="nb-control" aria-hidden="true">□</span>
            <button
              className="nb-control nb-control-btn"
              onClick={() => navigate("/")}
              aria-label="Close window and return to desktop"
              title="Close — back to desktop"
            >
              ×
            </button>
          </div>
        </div>

        {/* Toolbar: back / up / address bar / drive switch */}
        <div className="nb-explorer-toolbar">
          <div className="nb-explorer-nav-btns">
            <button
              className="nb-explorer-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              title="Back"
            >
              ◀
            </button>
            <button
              className="nb-explorer-btn"
              onClick={goUp}
              aria-label={atRoot ? "Up to desktop" : `Up to ${drive.letter} drive root`}
              title="Up one level"
            >
              ▲
            </button>
          </div>

          <div className="nb-address-bar" aria-label="Current path">
            <span className="nb-address-label" aria-hidden="true">PATH:</span>
            <Link to="/" className="nb-crumb">▓</Link>
            <span className="nb-crumb-sep" aria-hidden="true">\</span>
            <Link to={drive.route} className={`nb-crumb${atRoot ? " active" : ""}`}>
              {drive.letter}:\{drive.label}
            </Link>
            {nodeId && (
              <>
                <span className="nb-crumb-sep" aria-hidden="true">\</span>
                <span className="nb-crumb active">{nodeId.toUpperCase()}</span>
              </>
            )}
          </div>

          {/* THE SWITCH — flip between the two lives */}
          <div className="nb-drive-switch" role="navigation" aria-label="Switch drive">
            <span className="nb-drive-switch-current" aria-current="true">
              {drive.letter}:\{drive.label}
            </span>
            <Link
              to={other.route}
              className="nb-drive-switch-other"
              title={`Switch to ${other.letter}:\\${other.label} — ${other.tagline}`}
            >
              ⇄ {other.letter}:\{other.label}
            </Link>
          </div>
        </div>

        {/* Body: sidebar tree + content */}
        <div className="nb-explorer-body">
          <aside className="nb-explorer-side" aria-label="Directory tree">
            <p className="nb-tree-drive">
              💾 {drive.letter}:\{drive.label}\
            </p>
            <ul className="nb-tree">
              {drive.children.map((child, i) => {
                const last = i === drive.children.length - 1;
                return (
                  <li key={child.id}>
                    <span className="nb-tree-branch" aria-hidden="true">
                      {last ? "└──" : "├──"}
                    </span>
                    <Link
                      to={`${drive.route}/${child.id}`}
                      className={`nb-tree-link${nodeId === child.id ? " active" : ""}`}
                    >
                      {child.icon} {child.kind === "dir" ? `${child.id}\\` : child.id}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="nb-tree-drive nb-tree-other">
              💾 OTHER LOCATIONS
            </p>
            <ul className="nb-tree">
              <li>
                <span className="nb-tree-branch" aria-hidden="true">├──</span>
                <Link to={other.route} className="nb-tree-link">
                  🔁 {other.letter}:\{other.label}\
                </Link>
              </li>
              <li>
                <span className="nb-tree-branch" aria-hidden="true">├──</span>
                <Link to="/contact" className="nb-tree-link">
                  📬 contact.txt
                </Link>
              </li>
              <li>
                <span className="nb-tree-branch" aria-hidden="true">└──</span>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nb-tree-link">
                  📄 resume.pdf
                </a>
              </li>
            </ul>
          </aside>

          <main className="nb-explorer-main">
            {atRoot ? (
              <FileListing drive={drive} />
            ) : node ? (
              <node.render />
            ) : (
              <NodeNotFound drive={drive} nodeId={nodeId} />
            )}
          </main>
        </div>

        {/* Status strip */}
        <div className="nb-explorer-status">
          <span>
            {atRoot
              ? `${drive.children.length} object(s)`
              : node
                ? `1 file open — ${node.type}`
                : "0 object(s)"}
          </span>
          <span className="nb-explorer-status-path">{drivePath(drive, nodeId)}</span>
        </div>
      </div>
    </div>
  );
}

export default Explorer;

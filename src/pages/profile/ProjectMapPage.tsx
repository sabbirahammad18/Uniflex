import { useState } from "react";
import FullSvgPlotMap from "@/components/UniplexMap/FullSvgPlotMap";
import { getApiUrl } from "@/utils/apiUrl";
import { useSearchParams, useNavigate } from "react-router-dom";

function GoogleMapExpiredModal({ onClose }: { onClose: () => void }) {
  return (
      <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 15, 15, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
      >
        <div
            style={{
              background: "#fff",
              borderRadius: 12,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
        >
          <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
            <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#FCEBEB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
            >
              <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A32D2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
            >
              Google map key expired
            </h3>
            <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#6b6b6b",
                }}
            >
              The map on this page can't load because the Google Maps API key
              has expired. Please renew it to restore full map functionality.
            </p>
          </div>

          <div
              style={{
                display: "flex",
                gap: 10,
                padding: "16px 28px 24px",
              }}
          >
            <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                  background: "#fff",
                  color: "#444",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
            >
              Dismiss
            </button>
            <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#E24B4A",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
  );
}

export default function ProjectMapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("project_id") || "1";
  const [showExpiredModal, setShowExpiredModal] = useState(true);

  const handleClose = () => {
    setShowExpiredModal(false);
    navigate("/");
  };

  return (
      <>
        {showExpiredModal && <GoogleMapExpiredModal onClose={handleClose} />}
        <FullSvgPlotMap
            apiUrl={getApiUrl(`projects/${encodeURIComponent(projectId)}/plots`)}
        />
      </>
  );
}
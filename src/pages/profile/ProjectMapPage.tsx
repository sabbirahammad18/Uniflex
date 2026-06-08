import FullSvgPlotMap from "@/components/UniplexMap/FullSvgPlotMap";
import { getApiUrl } from "@/utils/apiUrl";
import { useSearchParams } from "react-router-dom";

export default function ProjectMapPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id") || "1";

  return <FullSvgPlotMap apiUrl={getApiUrl(`projects/${encodeURIComponent(projectId)}/plots`)} />;
}

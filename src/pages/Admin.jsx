import WorksEditor from "../lib/WorksEditor";
import BtsEditor from "../lib/BtsEditor";
import StatsEditor from "../lib/StatsEditor";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div
      className="admin-dashboard"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <header style={{ marginBottom: "3rem" }}>
        <h1>Admin Dashboard</h1>
        <p>
          Logged in as: <strong>{user?.email}</strong>
        </p>
      </header>

      <WorksEditor sectionName="featuredWorks" />
      <hr
        style={{ margin: "3rem 0", border: "0", borderTop: "1px solid #eee" }}
      />
      <WorksEditor sectionName="worksArchive" />
      <hr
        style={{ margin: "3rem 0", border: "0", borderTop: "1px solid #eee" }}
      />
      <BtsEditor />
      <hr
        style={{ margin: "3rem 0", border: "0", borderTop: "1px solid #eee" }}
      />
      <StatsEditor />
    </div>
  );
}

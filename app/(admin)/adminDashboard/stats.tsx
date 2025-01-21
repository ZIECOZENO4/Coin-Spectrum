import { useDashboard } from "@/hook/useDashboard";

function DashboardComponent() {
    const { data, isLoading, error } = useDashboard();
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading dashboard</div>;
    if (!data) return null;
  
    return (
      <div>
        <h2>Dashboard Statistics</h2>
        <div>Total Users: {data.statistics.totalUsers}</div>
        {/* Rest of your dashboard UI */}
      </div>
    );
  }
  
  export default DashboardComponent;
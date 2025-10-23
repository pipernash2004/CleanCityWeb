import ReportForm from "@/components/ReportForm";

export default function Submit() {
  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Submit a Report</h1>
          <p className="text-muted-foreground">
            Help improve your community by reporting local issues
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}

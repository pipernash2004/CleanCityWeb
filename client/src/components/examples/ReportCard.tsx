import ReportCard from "../ReportCard";
import wasteImage from "@assets/generated_images/Waste_dumping_report_example_b439383d.png";
import waterImage from "@assets/generated_images/Water_leak_report_example_b22dadea.png";

export default function ReportCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      <ReportCard
        id="1"
        title="Illegal Waste Dumping on 5th Avenue"
        description="Large amounts of trash and plastic bags dumped on the street corner. This has been ongoing for several weeks and creating health hazards."
        category="waste"
        status="pending"
        location="5th Avenue & Main Street, Harare"
        imageUrl={wasteImage}
        createdAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
      />
      <ReportCard
        id="2"
        title="Water Pipe Burst Near Community Center"
        description="Major water leak from broken pipe causing flooding on the road. Water is being wasted and the road is becoming damaged."
        category="water"
        status="in-progress"
        location="Community Center Road, Bulawayo"
        imageUrl={waterImage}
        createdAt={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)}
      />
      <ReportCard
        id="3"
        title="Large Pothole on Highway Exit"
        description="Deep pothole causing vehicle damage and traffic delays. Multiple cars have reported tire damage."
        category="road"
        status="resolved"
        location="Highway 2 Exit 12"
        createdAt={new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)}
      />
    </div>
  );
}

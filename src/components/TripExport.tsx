"use client";

import { Download, Calendar, Printer } from "lucide-react";
import * as ics from "ics";

export default function TripExport({ trip }: { trip: any }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCalendar = () => {
    const events: ics.EventAttributes[] = [];

    trip.stops.forEach((stop: any) => {
      stop.activities.forEach((act: any) => {
        // Mock dates based on trip start for the hackathon prototype
        // In a real app, activities should have specific start/end times
        const startDate = new Date(trip.startDate);
        // Add random hours just for the prototype demo
        startDate.setHours(9 + Math.floor(Math.random() * 8));

        events.push({
          title: act.title,
          description: act.category,
          location: act.location || stop.city,
          start: [
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate(),
            startDate.getHours(),
            0
          ],
          duration: { hours: 2 }
        });
      });
    });

    ics.createEvents(events, (error, value) => {
      if (error) {
        console.log(error);
        alert("Failed to generate calendar file");
        return;
      }
      
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${trip.title.replace(/\s+/g, '_')}_itinerary.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handlePrint}
        className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/30 flex items-center gap-2"
        title="Download PDF"
      >
        <Printer size={16} /> Print / PDF
      </button>
      <button 
        onClick={handleExportCalendar}
        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg flex items-center gap-2"
        title="Export to Calendar"
      >
        <Calendar size={16} /> iCal
      </button>
    </div>
  );
}

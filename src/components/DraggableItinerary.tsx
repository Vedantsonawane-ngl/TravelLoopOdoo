"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, DollarSign, Plus } from "lucide-react";

export default function DraggableItinerary({ initialStops }: { initialStops: any[] }) {
  const [stops, setStops] = useState(initialStops);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceStopId = result.source.droppableId;
    const destStopId = result.destination.droppableId;
    
    // Create a new copy of stops
    const newStops = [...stops];
    
    // Find the source and destination stops
    const sourceStopIndex = newStops.findIndex(s => s.id === sourceStopId);
    const destStopIndex = newStops.findIndex(s => s.id === destStopId);
    
    if (sourceStopIndex === -1 || destStopIndex === -1) return;

    const sourceActivities = [...newStops[sourceStopIndex].activities];
    const destActivities = sourceStopId === destStopId ? sourceActivities : [...newStops[destStopIndex].activities];

    // Remove from source
    const [movedActivity] = sourceActivities.splice(result.source.index, 1);

    // Add to destination
    destActivities.splice(result.destination.index, 0, movedActivity);

    // Update state
    newStops[sourceStopIndex].activities = sourceActivities;
    if (sourceStopId !== destStopId) {
      newStops[destStopIndex].activities = destActivities;
    }

    setStops(newStops);
    
    // In a real app, you would also make an API call to save the new order/stopId
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-6">
        {stops.map((stop, index) => (
          <div key={stop.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Day Header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 font-bold px-3 py-1.5 rounded-lg text-sm">
                  Day {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{stop.city}, {stop.country}</h3>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus size={20} />
              </button>
            </div>

            {/* Droppable Area for Activities */}
            <Droppable droppableId={stop.id}>
              {(provided, snapshot) => (
                <div 
                  className={`p-4 space-y-3 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                >
                  {stop.activities.length === 0 && !snapshot.isDraggingOver ? (
                    <p className="text-sm text-slate-500 text-center py-4">No activities planned for this day yet.</p>
                  ) : null}
                  
                  {stop.activities.map((activity: any, actIndex: number) => (
                    <Draggable key={activity.id} draggableId={activity.id} index={actIndex}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex items-center gap-4 p-3 rounded-2xl border ${snapshot.isDragging ? 'border-brand-500 shadow-xl bg-white dark:bg-slate-800 scale-[1.02]' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-transparent'} transition-all`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="text-slate-300 dark:text-slate-600 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1"
                          >
                            <GripVertical size={20} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{activity.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                                {activity.category}
                              </span>
                              {activity.description && (
                                <span className="text-xs text-slate-500 truncate max-w-xs">{activity.description}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium text-sm px-4">
                            <DollarSign size={14} className="text-emerald-500" />
                            {activity.cost || 0}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  <button className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-medium hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-center gap-2 text-sm">
                    <Plus size={16} /> Add Activity
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

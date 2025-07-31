import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import { EventContentArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

import { useEffect, useState } from "react";

import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id: string,
  name: string,
  startTime: string;    //ISO String from database
  endTime: string;      //ISO String from database
  notes: string;
}

export default function Schedule({selectedProfileId}: {selectedProfileId: string}){
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    startTime:"",
    endTime:"",
    notes:""
  });
  useEffect(()=> {
    async function fetchEvents(){
    
      const response = await fetch(`/api/profiles/${selectedProfileId}/events`);
      if(response.ok){
        const data = await response.json();
        setEvents(data.events);
      }
      else{
        const error = await response.json();
        console.error("failed to fetch events,", error);
      }    
    }
    if(selectedProfileId){
      fetchEvents();
    }
  }, [selectedProfileId])
  {/* Display dialog box for creating event*/}
  function handleDateClick(info:any){
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    // Set default times for the selected date
    setNewEvent({
      name:"",
      date: clickedDate,
      startTime: "09:00",
      endTime: "10:00",
      notes:""
    })
    setIsDialogOpen(true);    // triggers dialog box
  }
  {/*Cancel creating event -> close the dialog,erase the event,unselectDate, unsetLoading */}
  function handleCloseDialog(){
    setIsDialogOpen(false);
    setNewEvent({name:"",date:"", startTime:"",endTime:"",notes:""});
    setSelectedDate("");
  }

  {/* Create event -> add to events[],close the Dialog,erase the event, unselectDate */}
  async function handleCreateEvent(){
    let startDateTime,endDateTime;
    // Validate
    if(!newEvent.name.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime){
      alert("Please enter all required fields(*)")
      return;
    }

    // Create database start and end time format
    startDateTime = `${newEvent.date}T${newEvent.startTime}`;
    endDateTime = `${newEvent.date}T${newEvent.endTime}`
    if(startDateTime >= endDateTime){
      alert("End time should be after start time.");
      return;
    }
    setIsLoading(true);
    
    try{
      const response = await fetch(
        `/api/profiles/${selectedProfileId}/events`,
        {
          method: "POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
            name:newEvent.name,
            startTime:startDateTime,    // ISO string
            endTime:endDateTime,        // ISO string
            notes: newEvent.notes
          })
        }
      );
      if(response.ok){
        const data = await response.json();
        setEvents(prev=>[...prev, data.event]);   //Add new event
        handleCloseDialog();    // close dialog and reset form
      }
      else{
        const errorData = await response.json();
        alert(`Failed to create event: ${errorData.error || 'Unknown error'}`);
      }
    }catch(error){
      console.error('Failed to create event:', error);
      alert("Failed to create event. Please try again.");
    }finally{
      setIsLoading(false);
    }
  }

  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.name,
    start: event.startTime,
    end: event.endTime,
    extendedProps: {
      notes: event.notes
    }
  }));

  return (
    <>
      <div className="p-6 h-full box-border">
        <FullCalendar 
          height="100%"
          expandRows={true}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          dateClick={(e) => {handleDateClick(e)}}
          events={formattedEvents}
          
          // eventContent={renderEventContent}
        />
      </div>
      {/* Event creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new Event</DialogTitle>
            <DialogDescription>
              Add a new event for {selectedDate && new Date(selectedDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-name" className="text-right">
                Name *
              </Label>
              <Input 
                id="event-name" 
                value={newEvent.name} 
                onChange={(e)=>setNewEvent(prev => ({...prev, name:e.target.value}))} 
                className="col-span-3"
                placeholder="Enter event name"
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date * </Label>
              <Input
                id="event-date"
                type="date"
                value={newEvent.date}
                onChange={(e)=>setNewEvent(prev=>({...prev,date:e.target.value}))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor= "start-time" className="text-right"> 
                Start time *
              </Label>
              <Input
                id="start-time" 
                type="time"
                value={newEvent.startTime}
                onChange={(e)=> setNewEvent(prev=>({...prev,startTime:e.target.value}))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End time *
              </Label>
              <Input
                id="end-time"
                type="time"
                value={newEvent.endTime}
                onChange={(e)=>setNewEvent(prev=>({...prev, endTime:e.target.value}))}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="textRight">Notes </Label>
              <Textarea
                id="notes"
                value={newEvent.notes}
                onChange={(e)=>setNewEvent(prev=>({...prev, notes:e.target.value}))}
                className="col-span-3"
                placeholder="Optional notes..."
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

}

// a custom render function
function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>   
      <i>{eventInfo.event.title}</i>
    </>
  )
}
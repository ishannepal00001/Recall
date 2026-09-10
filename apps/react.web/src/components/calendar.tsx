import { useState } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { dummyEvents } from '../dummydata'

export default function Calendar() {
  const [eventsService] = useState(() => createEventsServicePlugin())

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: dummyEvents,
    plugins: [eventsService],
    isDark: true,
  })

  return (
    <div className="sx-react-calendar-wrapper w-full max-w-full h-[850px] min-h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] flex flex-col [&_>div]:flex-1 [&_>div]:h-full [&_.sx__calendar]:h-full [&_.sx__month-grid]:min-h-[600px]">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

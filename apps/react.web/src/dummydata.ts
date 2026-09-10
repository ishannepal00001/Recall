import { Temporal } from 'temporal-polyfill'

export const dummyEvents = [
  {
    id: '1',
    title: 'Wardrobe Refresh',
    start: Temporal.ZonedDateTime.from('2026-09-28T10:00:00+05:45[Asia/Kathmandu]'),
    end: Temporal.ZonedDateTime.from('2026-09-28T11:00:00+05:45[Asia/Kathmandu]'),
  },
  {
    id: '2',
    title: 'Financial Review',
    start: Temporal.ZonedDateTime.from('2026-10-02T14:00:00+05:45[Asia/Kathmandu]'),
    end: Temporal.ZonedDateTime.from('2026-10-02T15:00:00+05:45[Asia/Kathmandu]'),
  },
  {
    id: '3',
    title: 'Task Sprint',
    start: Temporal.PlainDate.from('2026-10-05'),
    end: Temporal.PlainDate.from('2026-10-05'),
  },
  {
    id: '4',
    title: 'Plans Kickoff',
    start: Temporal.ZonedDateTime.from('2026-09-20T09:00:00+05:45[Asia/Kathmandu]'),
    end: Temporal.ZonedDateTime.from('2026-09-20T10:30:00+05:45[Asia/Kathmandu]'),
  },
  {
    id: '5',
    title: 'Events Sync',
    start: Temporal.PlainDate.from('2026-09-25'),
    end: Temporal.PlainDate.from('2026-09-25'),
  },
]

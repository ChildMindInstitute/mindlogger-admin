import { ReactNode } from 'react';
import { EventWrapperProps as CalendarEventWrapperProps } from 'react-big-calendar';

import { CalendarEvent } from '../Calendar.types';

export type EventWrapperProps = CalendarEventWrapperProps<CalendarEvent> & { children: ReactNode };

import {defineField, defineType} from 'sanity'

export const run = defineType({
  name: 'run',
  title: 'Runs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'activityId',
      title: 'Activity ID',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDateLocal',
      title: 'Start Date (Local)',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'distanceMeters',
      title: 'Distance (meters)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'movingTimeSeconds',
      title: 'Moving Time (seconds)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'elevationGainMeters',
      title: 'Elevation Gain (meters)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'averageSpeed',
      title: 'Average Speed (m/s)',
      type: 'number',
    }),
    defineField({
      name: 'maxSpeed',
      title: 'Max Speed (m/s)',
      type: 'number',
    }),
    defineField({
      name: 'averageCadence',
      title: 'Average Cadence',
      type: 'number',
    }),
    defineField({
      name: 'averageTemp',
      title: 'Average Temperature',
      type: 'number',
    }),
    defineField({
      name: 'averageWatts',
      title: 'Average Power',
      type: 'number',
    }),
    defineField({
      name: 'maxWatts',
      title: 'Max Power',
      type: 'number',
    }),
    defineField({
      name: 'hasHeartrate',
      title: 'Has Heartrate',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'averageHeartrate',
      title: 'Average Heartrate',
      type: 'number',
    }),
    defineField({
      name: 'maxHeartrate',
      title: 'Max Heartrate',
      type: 'number',
    }),
    defineField({
      name: 'elevHigh',
      title: 'Highest Elevation',
      type: 'number',
    }),
    defineField({
      name: 'elevLow',
      title: 'Lowest Elevation',
      type: 'number',
    }),
    defineField({
      name: 'startLocation',
      title: 'Start Location',
      type: 'geopoint',
    }),
    defineField({
      name: 'endLocation',
      title: 'End Location',
      type: 'geopoint',
    }),
    defineField({
      name: 'summaryPolyline',
      title: 'Summary Polyline',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      distance: 'distanceMeters',
      date: 'startDateLocal',
    },
    prepare({title, distance, date}) {
      const distanceKm =
        typeof distance === 'number' ? `${(distance / 1000).toFixed(2)} km` : 'Unknown distance'
      const subtitle = [distanceKm, date ? new Date(date).toLocaleDateString() : null]
        .filter(Boolean)
        .join(' · ')

      return {title, subtitle}
    },
  },
})

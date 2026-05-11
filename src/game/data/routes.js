export const starterRoute = {
  id: 'line-1-riverside-loop',
  line: 'Linie 1',
  name: 'Riverside Loop',
  targetDurationSeconds: 240,
  baseReward: 420,
  stops: [
    {
      id: 'central-station',
      name: 'Hauptbahnhof',
      position: { x: -320, y: -180 },
      waitingPassengers: 7,
    },
    {
      id: 'market-square',
      name: 'Marktplatz',
      position: { x: 80, y: -180 },
      waitingPassengers: 5,
    },
    {
      id: 'school-campus',
      name: 'Schulzentrum',
      position: { x: 300, y: 90 },
      waitingPassengers: 12,
    },
    {
      id: 'green-fields',
      name: 'Grüne Felder',
      position: { x: -230, y: 260 },
      waitingPassengers: 4,
    },
  ],
};

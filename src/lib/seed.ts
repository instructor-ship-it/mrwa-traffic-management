import { db } from '@/lib/db';

interface SeedAlert {
  bannerColour: string;
  bannerType: string;
  eqsafeNumber: string;
  dateOfIncident: string;
  timeOfIncident: string;
  directorateRegion: string;
  mainRoadsOrContractor: string;
  eqsafeEventType: string;
  actualConsequence: string;
  potentialConsequence: string;
  incidentShortDescription: string;
  executiveSummary: string;
  contributingFactors: string[];
  correctiveActions: string[];
  icamInvestigation: boolean;
  trafficControlRelated: boolean;
  criticalRiskProfile: string;
  trafficControlNotes?: string;
  filename: string;
  incidentCategory: string;
  region: string;
}

function extractRegion(directorateRegion: string): string {
  if (directorateRegion.includes('Kimberley')) return 'Kimberley';
  if (directorateRegion.includes('Mid West') || directorateRegion.includes('Gascoyne')) return 'Mid West / Gascoyne';
  if (directorateRegion.includes('Goldfields') || directorateRegion.includes('Esperance')) return 'Goldfields-Esperance';
  if (directorateRegion.includes('Great Southern')) return 'Great Southern';
  if (directorateRegion.includes('Wheatbelt')) return 'Wheatbelt';
  if (directorateRegion.includes('GSR')) return 'GSR';
  return 'Unknown';
}

const alerts: SeedAlert[] = [
  {
    bannerColour: 'grey',
    bannerType: 'Final Notice',
    eqsafeNumber: '56820',
    dateOfIncident: '17th February 2026',
    timeOfIncident: '10:45 AM',
    directorateRegion: 'RMO, Wheatbelt',
    mainRoadsOrContractor: 'Contractor',
    eqsafeEventType: 'Injury/Illness',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Moderate',
    incidentShortDescription: 'Quick-Cut Saw Strikes Worker in Face',
    executiveSummary:
      'A Contractor Worker was cutting a 450mm RCP to length at the Road Train Assembly Area in Northam. As the IP inserted the quick-cut saw blade to complete the final cut, the kerf closed on the blade, causing the saw to kick upward and rotate backwards. The blade contacted the IP on the right side of their face, resulting in a laceration from nose to lower lip.',
    contributingFactors: [
      'Kerf closed on the saw blade during final cut',
      'Pipe was positioned on residual sand material',
      'Quick-cut saw kicked upward when blade was pinched',
    ],
    correctiveActions: [],
    icamInvestigation: false,
    trafficControlRelated: false,
    criticalRiskProfile: '',
    filename: 'Grey Banner Alert - Final Notice - 56820 - Concrete Saw Strikes Worker in Face - 17 February 2026.pdf',
    incidentCategory: 'Equipment & Tools',
    region: 'Wheatbelt',
  },
  {
    bannerColour: 'grey',
    bannerType: 'Final Notice',
    eqsafeNumber: '57148',
    dateOfIncident: '04/03/2026',
    timeOfIncident: '12:45 PM',
    directorateRegion: 'GSR',
    mainRoadsOrContractor: 'Main Roads',
    eqsafeEventType: 'Injury/Illness',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Moderate',
    incidentShortDescription: 'Shoulder injury resulting in LTI',
    executiveSummary:
      'IP attempted to pull-start pressure water pump in a gravel pit. After several pull-starts with no success, IP heard a popping sound and felt pain in their right shoulder and right side of their neck. A certificate of no capacity was issued from 04/03/2026 to 11/03/2026.',
    contributingFactors: [
      'Pressure water pump fuel line not isolated during transport causing hydraulic lock',
      'Pressure was not released from the pressure wand trigger before attempting pull starts',
      'Pull cord on the pressure water pump was short, preventing full arm extension',
    ],
    correctiveActions: [
      'Replacement of pressure washer pump pull cord with one of suitable length',
      'Reaffirmed requirement to release pressure with wand trigger before pull cord starts',
      'Reaffirmed requirement to isolate pressure washer pump fuel line before transporting',
    ],
    icamInvestigation: false,
    trafficControlRelated: false,
    criticalRiskProfile: '',
    filename: 'Grey Banner Alert - Final Notice - 57148 - Shoulder injury resulting in LTI - 4 March 2026.pdf',
    incidentCategory: 'Equipment & Tools',
    region: 'GSR',
  },
  {
    bannerColour: 'grey',
    bannerType: 'Final Notice',
    eqsafeNumber: '57539',
    dateOfIncident: '23 March 2026',
    timeOfIncident: '11:40 AM',
    directorateRegion: 'RMO - Goldfields-Esperance',
    mainRoadsOrContractor: 'Main Roads',
    eqsafeEventType: 'Lost Time Injury',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Moderate',
    incidentShortDescription: 'Worker tripped over parking bay wheel stop bar',
    executiveSummary:
      'A worker was preparing to depart the office to deliver supplies. After placing items in the vehicle and closing/locking it, the worker tripped over the parking bay wheel stop bar in the next parking bay. They overstretched their left leg to prevent falling, resulting in a pulled muscle. The worker was wearing sandals. A medical certificate deemed the worker unfit for work for 2 days, resulting in an LTI.',
    contributingFactors: [
      'No signage specifically identifying the presence of a tripping hazard at parking bays',
      'Worker was unaware of the hazard when walking back to the office',
      'Colour marking on the parking bay wheel stop bar had faded over time',
      'Worker was requested at short notice to collect and deliver supplies',
    ],
    correctiveActions: [],
    icamInvestigation: false,
    trafficControlRelated: false,
    criticalRiskProfile: '',
    filename: 'Grey Banner Alert - Final Notice - 57539 - Worker tripped over parking bay wheel stop bar - 23 March 2026.pdf',
    incidentCategory: 'Slips, Trips & Falls',
    region: 'Goldfields-Esperance',
  },
  {
    bannerColour: 'red',
    bannerType: 'Preliminary Notice',
    eqsafeNumber: '57801',
    dateOfIncident: '7th April 2026',
    timeOfIncident: '12:00 PM',
    directorateRegion: 'RMO - Kimberley',
    mainRoadsOrContractor: 'Main Roads',
    eqsafeEventType: 'Procedure Breach',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Major',
    incidentShortDescription:
      'Chain used for recovery of maintenance truck snaps and recoils, smashing through mesh guard and windscreen',
    executiveSummary:
      'Maintenance crews stopped to repair a pothole and the flocon truck became bogged on the road shoulder. No recovery gear was available, so the crew used a 10mm chain (lashing down the posi-track) to attempt recovery. The chain failed under load approximately 6 metres from the flocon, snapping and recoiling through the mesh windscreen guard and windscreen. No one was on foot at the time. Had workers been on foot, this may have resulted in serious injury or fatality due to chain strike.',
    contributingFactors: [
      'No recovery gear available on site',
      'Improvised recovery using a 10mm lashing chain not rated for recovery',
      'Chain failed under load at approximately 6m distance',
    ],
    correctiveActions: [],
    icamInvestigation: true,
    trafficControlRelated: true,
    criticalRiskProfile: '',
    trafficControlNotes:
      'Incident occurred during road maintenance activity (pothole repair) which requires traffic control setup',
    filename:
      'Red Banner Alert - Preliminary Notice - 57801  - Chain used for recovery of maintenance truck, snaps and recoils, smashing through mesh guard and .pdf',
    incidentCategory: 'Vehicle & Driving',
    region: 'Kimberley',
  },
  {
    bannerColour: 'red',
    bannerType: 'Preliminary Notice',
    eqsafeNumber: '57872',
    dateOfIncident: '11 April 2026',
    timeOfIncident: '6:15 AM',
    directorateRegion: 'RMO - Mid West - Gascoyne Region',
    mainRoadsOrContractor: 'Contractor',
    eqsafeEventType: 'Injury',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Moderate',
    incidentShortDescription:
      'Traffic Controller sustains shoulder injury slipping on roadside batter',
    executiveSummary:
      'While setting up traffic management signage for a road widening project, a Traffic Controller exited their vehicle on the passenger side. The TC\'s feet slipped on the soft batter at the shoulder of the road. The TC grabbed the door with their right hand and reached up with their left to grab the roll bar, immediately feeling pain in their left shoulder. The TC completed setup but was unable to continue works. X-rays showed no bone damage but further ultrasound assessment is required. TC was deemed unfit for work for 2 weeks (LTI).',
    contributingFactors: [
      'Soft batter at road shoulder caused TC to slip on vehicle exit',
      'TC exited from passenger side onto uneven terrain',
      'Early morning (6:15 AM) - potentially low light conditions',
    ],
    correctiveActions: [],
    icamInvestigation: true,
    trafficControlRelated: true,
    criticalRiskProfile: '',
    trafficControlNotes:
      'TC was directly engaged in traffic management signage deployment - the most directly TC-related alert in the collection',
    filename:
      'Red Banner Alert - Preliminary Notice - 57872 - TC sustains shoulder injury slipping on roadside batter - 11 April 2026.pdf',
    incidentCategory: 'Traffic Control',
    region: 'Mid West / Gascoyne',
  },
  {
    bannerColour: 'red',
    bannerType: 'Preliminary Notice',
    eqsafeNumber: '57935',
    dateOfIncident: '15th April 2026',
    timeOfIncident: '10:15 AM',
    directorateRegion: 'RMO - Great Southern Region',
    mainRoadsOrContractor: 'Main Roads',
    eqsafeEventType: 'Injury/Illness',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Moderate',
    incidentShortDescription: 'Worker struck on shin with sledgehammer, resulting in an LTI',
    executiveSummary:
      'Work crews were removing a large fallen tree branch from a side drain at a culvert face. After the chainsaw operator made top and bottom cuts leaving a strap, a wedge was placed in the cut and a hammer operator struck the wedge. The sledgehammer slipped off the plastic wedge and continued in an arc, striking the IP on the shin. First aid applied (rest, ice, elevation). IP was x-rayed and certified unfit for work for a day (LTI).',
    contributingFactors: [
      'Sledgehammer slipped off plastic wedge',
      'Method chosen (wedge + sledgehammer) rather than completing cuts with chainsaw',
      'Insufficient control of sledgehammer swing arc',
    ],
    correctiveActions: [],
    icamInvestigation: true,
    trafficControlRelated: false,
    criticalRiskProfile: '',
    filename:
      'Red Banner Alert - Preliminary Notice - 57935- Worker struck on shin with sledgehammer, resulting in a LTI- 15 April 2026.pdf',
    incidentCategory: 'Manual Handling',
    region: 'Great Southern',
  },
  {
    bannerColour: 'red',
    bannerType: 'Preliminary Notice',
    eqsafeNumber: '57937',
    dateOfIncident: '15 April 2026',
    timeOfIncident: '8:30 AM',
    directorateRegion: 'RMO - Goldfields Esperance Region',
    mainRoadsOrContractor: 'Contractor',
    eqsafeEventType: 'Damage/Loss',
    actualConsequence: 'Moderate',
    potentialConsequence: 'Major',
    incidentShortDescription: 'Truck rollover',
    executiveSummary:
      'A spreader truck travelling westbound on South Coast Highway to a pavement repair location, with a partial load of aggregate and towing a float with a multi-tyre roller, lost traction on a slick/wet surface at approximately 80 km/h. The truck and trailer slid sideways and the truck flipped onto its side; the roller was thrown from the float. Traffic management and supervisor arrived within 15 minutes; traffic control was established. Drug and alcohol testing completed (negative). Driver confirmed no injuries after health check.',
    contributingFactors: [
      'Wet/slick road surface',
      'Speed approximately 80 km/h while cornering',
      'Partial load + towing float with roller - potentially unstable load configuration',
    ],
    correctiveActions: [],
    icamInvestigation: true,
    trafficControlRelated: true,
    criticalRiskProfile: 'Vehicles and Driving',
    trafficControlNotes: 'Traffic control deployed as incident response after rollover',
    filename:
      'Red Banner Alert - Preliminary Notice - 57937 - Truck rollover - 15 April 2026.pdf',
    incidentCategory: 'Vehicle & Driving',
    region: 'Goldfields-Esperance',
  },
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.bannerAlert.deleteMany();

  for (const alert of alerts) {
    const region = alert.region || extractRegion(alert.directorateRegion);
    const pdfFilename = `EQSafe-${alert.eqsafeNumber}.pdf`;
    const pdfPath = `/pdfs/${pdfFilename}`;

    await db.bannerAlert.create({
      data: {
        eqsafeNumber: alert.eqsafeNumber,
        bannerColour: alert.bannerColour,
        bannerType: alert.bannerType,
        dateOfIncident: alert.dateOfIncident,
        timeOfIncident: alert.timeOfIncident || null,
        directorateRegion: alert.directorateRegion,
        mainRoadsOrContractor: alert.mainRoadsOrContractor,
        eqsafeEventType: alert.eqsafeEventType,
        actualConsequence: alert.actualConsequence,
        potentialConsequence: alert.potentialConsequence,
        incidentShortDesc: alert.incidentShortDescription,
        executiveSummary: alert.executiveSummary,
        contributingFactors: JSON.stringify(alert.contributingFactors),
        correctiveActions: JSON.stringify(alert.correctiveActions),
        icamInvestigation: alert.icamInvestigation,
        trafficControlRelated: alert.trafficControlRelated,
        trafficControlNotes: alert.trafficControlNotes || null,
        criticalRiskProfile: alert.criticalRiskProfile || null,
        incidentCategory: alert.incidentCategory,
        region: region,
        pdfPath: pdfPath,
        pdfFilename: pdfFilename,
      },
    });

    console.log(`  Created alert: ${alert.eqsafeNumber} - ${alert.incidentShortDescription}`);
  }

  console.log(`\nSeeding complete! Created ${alerts.length} alerts.`);
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
